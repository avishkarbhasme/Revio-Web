import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ToggleSubscribe = () => {
    const { channelId } =useParams()
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`api/v1/c/${channelId}`,{withCredentials:true});
        setSubscribed(response.data.subscribed);
      } catch (error) {
        console.error('Error fetching subscription status', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [channelId]);

  const toggleSubscription = async () => {
    if (!channelId) return;
    setLoading(true);
    try {
      const response = await axios.post(`/api/v1/c/${channelId}`,{withCredentials:true});
      setSubscribed(response.data.subscribed);
    } catch (error) {
      console.error('Error toggling subscription', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggleSubscription} disabled={ !channelId}>
      {loading ? 'Loading...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  );
};

export default ToggleSubscribe;
