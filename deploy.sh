set -e

yarn build

cd dist

echo 'xn--910b70m8xu.info' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/momenthana/corona.git master:gh-pages

cd -
