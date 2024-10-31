ren ".env.local" "temp.env.local"
npm run build
ren "temp.env.local" ".env.local"
