FROM alpine:latest

# cgo required due to gorm!

ENV CGO_ENABLED=1
ENV GO_VERSION=1.25.3
ENV GOOS=linux

RUN apk add --no-cache \
    build-base \
    gcc \
    g++ \
    make \
    git \
    wget \
    curl \
    && rm -rf /var/cache/apk/* 

# install go lang
RUN wget https://dl.google.com/go/go${GO_VERSION}.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz && \
    rm go${GO_VERSION}.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

COPY go.mod go.sum ./

RUN go mod download

# copy source code
COPY . .

# build the application
RUN go build -o backend

EXPOSE 3000

CMD [ "./backend" ]