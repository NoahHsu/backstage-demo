FROM python:3.10-alpine

RUN apk update && apk --no-cache add gcc musl-dev openjdk11-jdk curl graphviz ttf-dejavu fontconfig

RUN pip install --upgrade pip && pip install mkdocs-techdocs-core==1.2.0

RUN pip install mkdocs-kroki-plugin

ENTRYPOINT [ "mkdocs" ]
