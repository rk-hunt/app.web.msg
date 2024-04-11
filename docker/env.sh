#!/bin/bash

if [ ! -z ${NODE_ENV} ]; then
 cat <<END
 window.NODE_ENV='${NODE_ENV}';
 window.APP_API_URL='${REACT_APP_API_URL}';
END
fi