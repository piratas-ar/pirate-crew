# Uses inotify-tools to detect changes in the configuration file.

while true; do
  change=$(inotifywait -e close_write,moved_to,create .)
  change=${change#./ * }
  if [ "$change" = "start.sh" ]; then ./notify.js; fi
done
