docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
./wait-for-it.sh "postgresql://postgres:password@localhost:5432/rest-test" -- echo '🟢 - Database is ready!'
npm run db:migrate:dev
npm run db:seed
npm run test
docker-compose down