# Using ngrok for VNPAY Development Testing

## Install ngrok

1. Download ngrok: https://ngrok.com/download
2. Extract và add vào PATH
3. (Optional) Sign up để có auth token

## Start ngrok tunnel

```powershell
# Run ngrok to expose port 8000
ngrok http 8000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:8000
```

## Update .env

```env
# Keep sandbox credentials
VNPAY_TMN_CODE=484MK9DQ
VNPAY_HASH_SECRET=7JBKVKPJ7WDCJRRPBWJXS3EAT8XIS1O0
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Update URLs with ngrok domain
VNPAY_RETURN_URL=https://abc123.ngrok.io/orders/thank-you
VNPAY_IPN_URL=https://abc123.ngrok.io/vnpay/ipn
```

## Clear cache

```bash
php artisan config:clear
php artisan cache:clear
```

## Test payment

1. Checkout với VNPAY
2. Complete payment at VNPAY
3. IPN sẽ TỰ ĐỘNG được gọi qua ngrok tunnel!

## Check logs

```bash
# Watch for IPN callbacks
tail -f storage/logs/laravel.log | grep "VNPAY IPN"
```

## Notes

- ⚠️ ngrok URL thay đổi mỗi lần restart (trừ khi có paid account)
- ⚠️ Phải update .env mỗi lần restart ngrok
- ✅ Giống production 100%
- ✅ Không cần IPN simulator
