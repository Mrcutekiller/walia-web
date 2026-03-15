module.exports = [
"[project]/web/lib/user.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/2374f_@firebase_firestore_dist_common-1ab68354_node_cjs_a028cb0f.js",
  "server/chunks/ssr/2374f_@firebase_firestore_dist_index_node_cjs_c18e8215.js",
  "server/chunks/ssr/2374f_2ebac986._.js",
  "server/chunks/ssr/web_lib_user_ts_9612871f._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/web/lib/user.ts [app-ssr] (ecmascript)");
    });
});
}),
];