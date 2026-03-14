module.exports = [
"[project]/web/lib/user.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/web_lib_user_ts_9612871f._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/web/lib/user.ts [app-ssr] (ecmascript)");
    });
});
}),
];