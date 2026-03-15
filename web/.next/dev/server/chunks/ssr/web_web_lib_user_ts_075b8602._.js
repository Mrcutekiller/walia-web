module.exports = [
"[project]/web/web/lib/user.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/8f31d_@firebase_firestore_dist_common-1ab68354_node_cjs_d20e77a3.js",
  "server/chunks/ssr/8f31d_@firebase_firestore_dist_index_node_cjs_83bfa03f.js",
  "server/chunks/ssr/8f31d_f9861da2._.js",
  "server/chunks/ssr/web_web_lib_user_ts_0ff8dd6e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/web/web/lib/user.ts [app-ssr] (ecmascript)");
    });
});
}),
];