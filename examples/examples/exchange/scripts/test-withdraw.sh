#!/bin/bash

amount=$1

echo "Withdrawing $amount"
curl -i \
  -H "Content-Type: application/json" \
  -d "{ \"amount\": \"$amount\" }" \
  http://localhost:8080/withdraw

