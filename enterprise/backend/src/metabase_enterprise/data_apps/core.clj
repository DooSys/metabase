(ns metabase-enterprise.data-apps.core
  "What other modules may ask the data-apps module: what the files of an app's collection may hold."
  (:require
   [metabase-enterprise.data-apps.db :as data-apps.db]
   [metabase-enterprise.data-apps.resource-validation :as resource-validation]
   [metabase.api.common :as api]
   [metabase.models.interface :as mi]
   [metabase.premium-features.core :refer [defenterprise]]
   [potemkin :as p]))

(p/import-vars
 [resource-validation
  problems
  warnings])

(defenterprise check-data-app-access!
  "Checks that the user belongs to one of the assigned groups"
  :feature :data-apps
  [request]
  (let [app (api/check-404 (data-apps.db/enabled-data-app-by-slug (get-in request [:route-params :name])))]
    (api/check-403 (mi/can-read? app))))

(defenterprise visible-data-app-filter-select
  "A HoneySQL query of the ids of the data apps the user described by `user-info` can read: every app for a superuser,
  else the apps assigned to one of their groups, and none for a tenant user."
  :feature :data-apps
  [{:keys [user-id is-superuser?]}]
  (if is-superuser?
    (data-apps.db/data-app-ids-select)
    (data-apps.db/assigned-data-app-ids-select user-id)))
