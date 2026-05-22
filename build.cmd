ren ".env.local" "temp.env.local"
call npm run build
ren "temp.env.local" ".env.local"
