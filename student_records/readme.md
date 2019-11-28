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

Ctrl + C should be enough to stop it. You may also periodically want to prune images and containers, using:

```bash
docker image prune
docker container prune
```

# Use cases

Use cases can be found [here](../use_cases/sprint1.md).

# Sprint retrospectives

[Sprint 1](../student_retrospective/sprint1.pptx)