# Habibi Grill — Final Ordering Build

This build keeps the existing design and adds:

- 9.68% order-level sales tax
- Tips: No Tip, 5%, 10%, 15%, 20%
- Card, Apple Pay, and Google Pay through Square Web Payments SDK
- ASAP or scheduled pickup support
- SMS order-status automation through Square webhooks
- Duplicate-message protection when Vercel KV / Upstash is configured

## Order status → SMS mapping

- `RESERVED` → “We received your order and started preparing it.”
- `PREPARED` → “Your food is ready for pickup!”
- `COMPLETED` → “Sahtein! Enjoy your meal, King.”

The customer must leave **Send me text updates** checked during checkout.

## 1. Vercel environment variables

Copy the variables from `.env.example` into Vercel → Project → Settings → Environment Variables.

Keep your existing Square variables and add:

- `SQUARE_WEBHOOK_NOTIFICATION_URL`
- `SQUARE_WEBHOOK_SIGNATURE_KEY`
- `SMS_PROVIDER`
- `SMS_FROM_NUMBER`
- SMS provider credentials

## 2. Square webhook

In Square Developer Dashboard, create a webhook subscription pointing to:

`https://YOUR-DOMAIN.com/api/square-webhook`

Subscribe to:

- `order.updated`
- `order.fulfillment.updated`

Copy the webhook Signature Key into `SQUARE_WEBHOOK_SIGNATURE_KEY`.

The notification URL in Vercel must match the Square webhook URL exactly.

## 3. SMS and the Verizon truck number

A normal Verizon unlimited talk/text plan does **not** expose an API that this website can call directly. To send automated texts from `531-444-7691`, that number must be supported by an SMS API provider through porting, hosting, or another approved business-messaging arrangement.

The code supports:

- `SMS_PROVIDER=twilio`
- `SMS_PROVIDER=webhook` for another provider or bridge

Set `SMS_FROM_NUMBER=+15314447691` only after the provider confirms that it controls or is authorized to send from that number. Until then, use a verified provider number for testing.

## 4. Apple Pay

Apple Pay requires:

- HTTPS
- production Square credentials for live payments
- registering the production domain in Square / Apple Pay setup

The button hides automatically when Apple Pay is unavailable or the domain is not registered.

## 5. Google Pay

Google Pay appears only on supported devices/browsers. It uses the same Square backend endpoint as card payments.

## 6. Tax and tip logic

- Tax is applied by Square to the order at 9.68%.
- Tip is calculated from the pre-tax subtotal.
- The backend recalculates all totals; it does not trust browser totals.
- The payment amount equals Square order total plus tip.

## 7. Deploy

From this project folder:

```bash
git add .
git commit -m "Add tax tips wallets and SMS updates"
git push
```

Vercel redeploys automatically.

## 8. Test checklist

1. Card payment with No Tip.
2. Card payment with each tip option.
3. Confirm Square order shows 9.68% tax.
4. Confirm payment shows tip separately.
5. Test Apple Pay on Safari/iPhone after domain registration.
6. Test Google Pay on a supported browser/device.
7. In Square, change fulfillment state to `RESERVED`, `PREPARED`, then `COMPLETED` and confirm one SMS per state.

## Important SMS setup
The site code cannot send carrier SMS using an ordinary Verizon mobile plan by itself.
To activate status texts, configure either:
- Twilio (or another SMS API provider), or
- a Verizon/business messaging API bridge exposed as SMS_WEBHOOK_URL.

You must also create a Square webhook for `order.updated` and set these Vercel variables:
- SQUARE_WEBHOOK_NOTIFICATION_URL
- SQUARE_WEBHOOK_SIGNATURE_KEY
- SMS_PROVIDER
- SMS_FROM_NUMBER
- the provider credentials

Without those external credentials, changing an order to preparing/ready/completed will not send a text.

## V2 menu presentation update

- Mobile menu cards use two columns so guests can see more items at once.
- Each supported meal has a **What is [meal]?** button.
- The meal information popup includes the supplied video, description, price, and a **Customize & Add to Cart** button.
- Added a Desserts category with the Crepe at $4.99 using the supplied photo.
- Videos are converted to browser-friendly MP4 and loaded only when a guest opens the meal information popup.
