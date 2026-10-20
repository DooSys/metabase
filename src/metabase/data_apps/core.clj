(ns metabase.data-apps.core
  (:require
   [metabase.premium-features.core :refer [defenterprise]]))

(defenterprise check-data-app-access!
  "Authorize the data app before serving its HTML entry point."
  metabase-enterprise.data-apps.core
  [_request]
  nil)

(defenterprise visible-data-app-filter-select
  "A HoneySQL query of the ids of the data apps the user described by `user-info` (`:user-id`, `:is-superuser?`) can
  read, or nil when they can read none, as without the data apps feature."
  metabase-enterprise.data-apps.core
  [_user-info]
  nil)
