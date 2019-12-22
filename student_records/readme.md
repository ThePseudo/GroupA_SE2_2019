# Instructions

## Build

```bash
docker image build -t students:1.0 .
```

### Start

```bash
docker run -it -p 8080:8080 -p 8000:8000 --name students students:1.0
```

### Stop

```bash
docker container rm --force students
```

You may also periodically want to prune images and containers, using:

```bash
docker image prune
docker container prune
```

# Use cases

Use cases can be found [here](../use_cases/sprint1.md).

# Sprint retrospectives

+ [Sprint 1](../student_retrospective/sprint1.pptx)
+ [Sprint 2](../student_retrospective/sprint2.pptx)
+ [Sprint 3](../student_retrospective/sprint3.pptx)