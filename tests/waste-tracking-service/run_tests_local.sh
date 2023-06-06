#cucumber  --format pretty --expand --format json -o "report.json" --out report.html --tags 'not @ignore' --tags @t
mkdir -p report
export START_PAGE_URL=http://localhost:4200
cucumber --color --format pretty --format html --out ./report/cucumber-report.html --format json --out test-report.json --tags 'not @ignore'
