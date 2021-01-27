import { Injectable, NgZone } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import {
  Gtag,
  GtagAction,
  GtagContent,
  GtagCustomParams,
  GtagEventParams,
  GtagProduct,
  GtagPromotion,
} from './../models/gtag.models';

declare const gtag: Gtag;

@Injectable({
  providedIn: 'root',
})
export class GtagService {
  //  Fields
  protected gtag: Gtag;

  //  Properties

  //  Constructors
  constructor(protected settings: LCUServiceSettings, protected zone: NgZone) {
    this.loadGtag();
  }

  public AddPaymentInfo() {
    return this.Event('add_payment_info');
  }

  public AddToCart(action?: GtagAction) {
    return this.Event('add_to_cart', action);
  }

  public AddToWishlist(action?: GtagAction) {
    return this.Event('add_to_wishlist', action);
  }

  public BeginCheckout(action?: GtagAction) {
    return this.Event('begin_checkout', action);
  }

  public CheckoutProgress(action?: GtagAction) {
    return this.Event('checkout_progress', action);
  }

  public Disable(
    value: boolean = true,
    id: string = this.settings.State.Google?.Analytics?.MeasurementID
  ) {
    window[`ga-disable-${id}`] = value;
  }

  public Enable() {
    return this.Disable(false);
  }

  public Event(action: string, params?: GtagEventParams): Promise<void> {
    // Wraps the event call into a Promise
    return this.zone.runOutsideAngular(
      () =>
        new Promise((resolve, reject) => {
          try {
            // Triggers a 1s time-out timer
            const tmr = setTimeout(
              () => reject(new Error('gtag call timed-out')),
              this.settings.State.Google?.Analytics?.Timeout || 10000
            );
            // Performs the event call resolving with the event callback
            this.gtag('event', action, {
              ...params,
              event_callback: () => {
                clearTimeout(tmr);
                resolve();
              },
            });
          } catch (e) {
            // Rejects the promise on errors
            reject(e);
          }
        })
    );
  }

  public Exception(description?: string, fatal?: boolean) {
    return this.Event('exception', { description, fatal });
  }

  public GenerateLead(action?: GtagAction) {
    return this.Event('generate_lead', action);
  }

  public Login(method?: string) {
    return this.Event('login', { method });
  }

  public PageView(title?: string, path?: string, location?: string) {
    return this.Event('page_view', {
      page_title: title,
      page_location: location,
      page_path: path,
    });
  }

  public Purchase(action?: GtagAction) {
    return this.Event('purchase', action);
  }

  public Refund(action?: GtagAction) {
    return this.Event('refund', action);
  }

  public RemoveFromCart(action?: GtagAction) {
    return this.Event('remove_from_cart', action);
  }

  public ScreenView(
    appName: string,
    screenName: string,
    appId?: string,
    appVersion?: string,
    appInstallerId?: string
  ) {
    return this.Event('screen_view', {
      app_name: appName,
      screen_name: screenName,
      app_id: appId,
      app_version: appVersion,
      app_installer_id: appInstallerId,
    });
  }

  public SetCheckoutOption(checkoutStep?: number, checkoutOption?: string) {
    return this.Event('set_checkout_option', {
      checkout_step: checkoutStep,
      checkout_option: checkoutOption,
    });
  }

  public Search(searchTerm?: string) {
    return this.Event('search', {
      search_term: searchTerm,
    });
  }

  public SelectContent(content?: GtagContent) {
    return this.Event('select_content', content);
  }

  public Set(params: GtagCustomParams): void {
    return this.gtag('set', params);
  }

  public Share(method?: string, content?: GtagContent) {
    return this.Event('share', { method, ...content });
  }

  public SignUp(method?: string) {
    return this.Event('sign_up', { method });
  }

  public TimingComplete(
    name: string,
    value: number,
    category?: string,
    label?: string
  ) {
    return this.Event('timing_complete', {
      name,
      value,
      event_category: category,
      event_label: label,
    });
  }

  public ViewItem(items?: GtagProduct[]) {
    return this.Event('view_item', { items });
  }

  public ViewItemList(items?: GtagProduct[]) {
    return this.Event('view_item_list', { items });
  }

  public ViewPromotion(promotions?: GtagPromotion[]) {
    return this.Event('view_promotion', { promotions });
  }

  public ViewSearchResults(searchTerm?: string) {
    return this.Event('view_search_results', { search_term: searchTerm });
  }

  //  Helpers
  protected loadGtag() {
    if ('gtag' in window) {
      this.gtag = gtag;
    } else {
      const script = document.createElement('script');

      script.src =
        'https://www.googletagmanager.com/gtag/js?id=' +
        this.settings.State.Google.Analytics.MeasurementID;

      script.type = 'text/javascript';

      script.async = true;

      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args) {
        (window as any).dataLayer.push(arguments);
      }

      gtag('js', new Date());

      gtag('config', this.settings.State.Google.Analytics.MeasurementID, {
        send_page_view: true,
      });

      // 'setParams' in config && gtag('set', config.setParams);

      // 'moreIds' in config && config.moreIds.forEach((id) => gtag('config', id));

      this.gtag = (window as any).gtag = gtag;
    }
  }
}
