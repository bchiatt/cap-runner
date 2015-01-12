# Runner
============================
### Code Badges
[![Build Status](https://travis-ci.org/bchiatt/cap-runner.svg)](https://travis-ci.org/bchiatt/cap-runner)
[![Coverage Status](https://coveralls.io/repos/bchiatt/cap-runner/badge.png)](https://coveralls.io/r/bchiatt/cap-runner)

### Screenshots
![Image1](/docs/screenshots/calculator.png)
![Image2](/docs/screenshots/therapist.png)
![Image3](/docs/screenshots/schedule.png)

### Description
Runner is an admission to discharge management web application for physical
(as well as occupational, speech, respiratory, etc.) therapy departments.
The purpose of Runner is to make it easier for rehab managers/schedulers to do
the hard work of projecting, tracking and evaluating treatment minutes or, as
Medicare calls them, resource utilization groups (RUG).

### Models & Database
```
User
```

```
Therapist
```

```
Client
```

```
Rug
```

```
Treatment
```

### Features
- [x] User Register/Login
- [x] Add/Edit Therapists
- [x] Add/Edit Clients
- [x] Edit Client Projected Treatment Minutes
- [x] Schedule Clients for Treatment
- [x] Verify Treatment Minutes and Archive

### Running Tests
```bash
$ npm install
$ npm test
```

### Contributors
- [Brian Hiatt](https://github.com/bchiatt)

### Hosted At
[Runner](http://runner.bchiatt.co)

### License
[MIT](LICENSE)
