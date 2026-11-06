#!/bin/sh
# Prints the average GPU "Device Utilization %" over a number of seconds.
# Usage: example/measure-gpu.sh [seconds]

duration_seconds="${1:-15}"
total=0
for _ in $(seq "$duration_seconds"); do
  utilization=$(ioreg -r -d 1 -c IOAccelerator | grep -o '"Device Utilization %"=[0-9]*' | head -1 | cut -d= -f2)
  total=$((total + utilization))
  sleep 1
done
echo "average GPU utilization: $((total / duration_seconds))%"
