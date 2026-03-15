import analytics from '@react-native-firebase/analytics';

/**
 * Walia Analytics Service
 * Provides bridges to native Firebase Analytics for AdMob metrics and tracking.
 */

export const logEvent = async (eventName: string, params?: { [key: string]: any }) => {
    try {
        await analytics().logEvent(eventName, params);
    } catch (error) {
        console.error('Analytics logEvent error:', error);
    }
};

/**
 * Logs an ecommerce_purchase event as requested in the AdMob guide.
 * This is crucial for calculating ARPU and ARPPU metrics in AdMob.
 */
export const logEcommercePurchase = async (params: {
    coupon?: string;
    currency?: string;
    value?: number;
    shipping?: number;
    transaction_id?: string;
}) => {
    try {
        await analytics().logPurchase({
            ...params,
            items: [], // Required by some versions of the SDK, can be empty for simple purchase tracking
        });
        console.log('Ecommerce purchase logged:', params);
    } catch (error) {
        console.error('Analytics logPurchase error:', error);
    }
};

/**
 * Sets user properties for custom audience building and ad targeting.
 */
export const setUserProperties = async (properties: { [key: string]: any }) => {
    try {
        await analytics().setUserProperties(properties);
    } catch (error) {
        console.error('Analytics setUserProperties error:', error);
    }
};

export default {
    logEvent,
    logEcommercePurchase,
    setUserProperties,
};
