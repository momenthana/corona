set -e

yarn build

cd dist

echo '코로나.info' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/momenthana/corona.git master:gh-pages

cd -
