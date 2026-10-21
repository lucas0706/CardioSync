#!/usr/bin/env bash

set -u
umask 077

ROOT="/workspaces/CardioSync"
LOGDIR="$ROOT/.local-tools/logs"

if ! mkdir -p "$LOGDIR"; then
  printf 'ERROR: no se pudo crear el directorio de registros.\n' >&2
  exit 1
fi

if [ "$#" -lt 1 ]; then
  printf 'Uso: %s script.sh [argumentos...]\n' "$0" >&2
  exit 2
fi

SCRIPT="$1"
shift

case "$SCRIPT" in
  /*) ;;
  *) SCRIPT="$ROOT/$SCRIPT" ;;
esac

if [ ! -f "$SCRIPT" ]; then
  printf 'ERROR: no existe el script: %s\n' "$SCRIPT" >&2
  exit 2
fi

STAMP="$(date '+%Y%m%d-%H%M%S-%N')"
NAME="$(basename "$SCRIPT" .sh | sed 's/[^[:alnum:]_.-]/_/g')"
LOG="$LOGDIR/${STAMP}-${NAME}.log"
STATUS="$LOGDIR/${STAMP}-${NAME}.exit"

printf 'Registro: %s\n' "$LOG"
printf 'Inicio: %s\n' "$(date -Is)"

bash "$SCRIPT" "$@" 2>&1 | tee "$LOG"
RESULT=${PIPESTATUS[0]}

STATUS_TMP="${STATUS}.tmp"
if printf '%s\n' "$RESULT" > "$STATUS_TMP"; then
  mv "$STATUS_TMP" "$STATUS"
else
  rm -f "$STATUS_TMP"
  printf 'ADVERTENCIA: no se pudo guardar el código de salida.\n' >&2
fi

printf '\nCódigo de salida del script: %s\n' "$RESULT"
printf 'Registro: %s\n' "$LOG"
printf 'Estado: %s\n' "$STATUS"

exit "$RESULT"
