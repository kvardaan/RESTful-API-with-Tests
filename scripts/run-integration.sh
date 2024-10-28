docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
./scripts/wait-for-it.sh "postgresql://postgres:password@localhost:5432/rest-test" -- echo '🟢 - Database is ready!'
npm install
npm run db:migrate:dev
npm run db:seed
npm run test auth
npm run test user
npm run test post
docker-compose down