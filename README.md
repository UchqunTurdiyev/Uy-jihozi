# Uy jihozi — Lead landing (Next.js App Router + Meta Pixel + CAPI + Telegram)

## Qanday ishlaydi

1. Mijoz saytga kiradi → **Meta Pixel** `PageView` yuboradi.
2. Forma (ism, telefon, joylashuv) to'ldirilib yuboriladi:
   - Brauzer Pixel `Lead` + server **Conversions API** `Lead` (bir xil `event_id` → deduplikatsiya).
   - Barcha shaxsiy ma'lumotlar Metaga **SHA-256** heshlangan holda yuboriladi (ph, fn, ln, ct, country, external_id) + fbp, fbc, IP, user-agent.
   - **Telegram bot** guruhga lid yuboradi, ostida qisqa havola: `Sotib oldi → Metaga yuborish`.
   - Mijoz **Telegram kanalga** yo'naltiriladi.
3. Havola ichida lid ma'lumotlari **AES-256-GCM** bilan shifrlangan (bazasiz ishlaydi, o'zgartirib bo'lmaydi).
4. Mijoz sotib olganda havolani bosasiz → Chrome'da sahifa ochiladi → **to'lov summasini** kiritasiz → server CAPI orqali `Purchase` (value + currency) yuboradi.
5. Meta Ads Managerda **Purchase** va **ROAS** ko'rinadi, algoritm shunga o'xshash xaridorlarga reklama ko'rsatishni o'rganadi.

## Sozlash

`.env.example` dan nusxa olib `.env.local` (yoki Vercel → Settings → Environment Variables) to'ldiring:

| O'zgaruvchi | Tavsif |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sayt domeni (https bilan) |
| `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` | Mijoz yo'naltiriladigan kanal |
| `NEXT_PUBLIC_META_PIXEL_ID` | Pixel (Dataset) ID |
| `META_CAPI_ACCESS_TOKEN` | Events Manager → Settings → Conversions API → Generate access token |
| `META_TEST_EVENT_CODE` | Faqat test vaqtida (Test events) |
| `META_CURRENCY` | `USD` (so'm kurs bo'yicha o'giriladi) yoki `UZS` |
| `UZS_PER_USD` | Dollar kursi |
| `TELEGRAM_BOT_TOKEN` | @BotFather dan |
| `TELEGRAM_CHAT_ID` | Lidlar tushadigan guruh ID (botni guruhga admin qiling) |
| `LEAD_SECRET` | Havolani shifrlash kaliti (32+ tasodifiy belgi) |
| `ADMIN_PIN` | Ixtiyoriy — Purchase sahifasida PIN so'raladi |

## Ishga tushirish

```bash
npm install
npm run dev
```

## Vercelga joylash

1. vercel.com → **Add New Project** → shu repozitoriyni tanlang.
2. Environment Variables qo'shing → **Deploy**.
3. Events Manager → **Test events** orqali `Lead` (Browser + Server, deduplicated) va `Purchase` kelayotganini tekshiring.

> Eslatma: Telegram inline tugmasi faqat `https` domen bilan ishlaydi (localhost'da matnli havola qoladi).
> Purchase lid kelgan kundan boshlab 7 kun ichida yuborilsa — atributsiya eng aniq bo'ladi.
