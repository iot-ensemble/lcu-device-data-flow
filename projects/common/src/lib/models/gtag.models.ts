export interface Gtag {
  (cmd: 'set', params: GtagCustomParams): void;

  (cmd: 'config', targetId: string, config?: GtagConfigParams): void;

  (cmd: 'event', action: string, params?: GtagEventParams): void;
}

export interface GtagCustomParams {
  [key: string]: any;
}

// @see: https://developers.google.com/gtagjs/reference/parameter#control_parameters
export interface GtagConfigParams extends GtagCustomParams {
  groups?: string | string[];
  send_to?: string | string[];
  event_callback?: () => void;
  event_timeout?: number;

  // @see: https://developers.google.com/analytics/devguides/collection/gtagjs#disable_pageview_measurement
  send_page_view?: boolean;

  // @see: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-link-attribution
  link_attribution?: boolean;

  // @see: https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
  anonymize_ip?: boolean;

  // @see: https://developers.google.com/analytics/devguides/collection/gtagjs/display-features
  allow_ad_personalization_signals?: boolean;
}

export interface GtagEventParams extends GtagCustomParams {
  non_interaction?: true;
  event_category?: string;
  event_label?: string;
  value?: number;
}

export interface GtagImpression {
  id: string;
  name: string;
  list_name?: string;
  brand?: string;
  category?: string;
  variant?: string;
  list_position?: number;
  price?: number;
}

export interface GtagProduct {
  id?: string;
  name?: string;
  brand?: string;
  category?: string;
  variant?: string;
  price?: number;
  quantity?: number;
  coupon?: string;
  list_position?: number;
}

export interface GtagPromotion {
  id?: string;
  name?: string;
  creative_name?: string;
  creative_slot?: string;
}

export interface GtagAction {
  transaction_id?: string;
  affiliation?: string;
  value?: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  items?: GtagProduct[];
  checkout_step?: number;
  checkout_option?: string;
}

export interface GtagContent {
  content_id?: string;
  content_type?: string;
  items?: GtagProduct[];
  promotions?: GtagPromotion[];
}
