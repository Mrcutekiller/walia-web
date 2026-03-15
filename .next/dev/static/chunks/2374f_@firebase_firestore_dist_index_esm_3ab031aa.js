(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregateField",
    ()=>AggregateField,
    "AggregateQuerySnapshot",
    ()=>AggregateQuerySnapshot,
    "DocumentSnapshot",
    ()=>DocumentSnapshot,
    "PersistentCacheIndexManager",
    ()=>PersistentCacheIndexManager,
    "QueryCompositeFilterConstraint",
    ()=>QueryCompositeFilterConstraint,
    "QueryConstraint",
    ()=>QueryConstraint,
    "QueryDocumentSnapshot",
    ()=>QueryDocumentSnapshot,
    "QueryEndAtConstraint",
    ()=>QueryEndAtConstraint,
    "QueryFieldFilterConstraint",
    ()=>QueryFieldFilterConstraint,
    "QueryLimitConstraint",
    ()=>QueryLimitConstraint,
    "QueryOrderByConstraint",
    ()=>QueryOrderByConstraint,
    "QuerySnapshot",
    ()=>QuerySnapshot,
    "QueryStartAtConstraint",
    ()=>QueryStartAtConstraint,
    "SnapshotMetadata",
    ()=>SnapshotMetadata,
    "Transaction",
    ()=>Transaction,
    "WriteBatch",
    ()=>WriteBatch,
    "_TestingHooks",
    ()=>TestingHooks,
    "addDoc",
    ()=>addDoc,
    "aggregateFieldEqual",
    ()=>aggregateFieldEqual,
    "aggregateQuerySnapshotEqual",
    ()=>aggregateQuerySnapshotEqual,
    "and",
    ()=>and,
    "average",
    ()=>average,
    "count",
    ()=>count,
    "deleteAllPersistentCacheIndexes",
    ()=>deleteAllPersistentCacheIndexes,
    "deleteDoc",
    ()=>deleteDoc,
    "disablePersistentCacheIndexAutoCreation",
    ()=>disablePersistentCacheIndexAutoCreation,
    "documentSnapshotFromJSON",
    ()=>documentSnapshotFromJSON,
    "enablePersistentCacheIndexAutoCreation",
    ()=>enablePersistentCacheIndexAutoCreation,
    "endAt",
    ()=>endAt,
    "endBefore",
    ()=>endBefore,
    "executeWrite",
    ()=>executeWrite,
    "getAggregateFromServer",
    ()=>getAggregateFromServer,
    "getCountFromServer",
    ()=>getCountFromServer,
    "getDoc",
    ()=>getDoc,
    "getDocFromCache",
    ()=>getDocFromCache,
    "getDocFromServer",
    ()=>getDocFromServer,
    "getDocs",
    ()=>getDocs,
    "getDocsFromCache",
    ()=>getDocsFromCache,
    "getDocsFromServer",
    ()=>getDocsFromServer,
    "getPersistentCacheIndexManager",
    ()=>getPersistentCacheIndexManager,
    "limit",
    ()=>limit,
    "limitToLast",
    ()=>limitToLast,
    "memoryEagerGarbageCollector",
    ()=>memoryEagerGarbageCollector,
    "memoryLocalCache",
    ()=>memoryLocalCache,
    "memoryLruGarbageCollector",
    ()=>memoryLruGarbageCollector,
    "onSnapshot",
    ()=>onSnapshot,
    "onSnapshotResume",
    ()=>onSnapshotResume,
    "onSnapshotsInSync",
    ()=>onSnapshotsInSync,
    "or",
    ()=>or,
    "orderBy",
    ()=>orderBy,
    "persistentLocalCache",
    ()=>persistentLocalCache,
    "persistentMultipleTabManager",
    ()=>persistentMultipleTabManager,
    "persistentSingleTabManager",
    ()=>persistentSingleTabManager,
    "query",
    ()=>query,
    "querySnapshotFromJSON",
    ()=>querySnapshotFromJSON,
    "runTransaction",
    ()=>runTransaction,
    "setDoc",
    ()=>setDoc,
    "setIndexConfiguration",
    ()=>setIndexConfiguration,
    "snapshotEqual",
    ()=>snapshotEqual,
    "startAfter",
    ()=>startAfter,
    "startAt",
    ()=>startAt,
    "sum",
    ()=>sum,
    "updateDoc",
    ()=>updateDoc,
    "where",
    ()=>where,
    "writeBatch",
    ()=>writeBatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$component$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/component/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/firestore/dist/common-091f2944.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/util/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$webchannel$2d$wrapper$2f$dist$2f$bloom$2d$blob$2f$esm$2f$bloom_blob_es2018$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$logger$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/logger/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$webchannel$2d$wrapper$2f$dist$2f$webchannel$2d$blob$2f$esm$2f$webchannel_blob_es2018$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const Ut = "@firebase/firestore", Ht = "4.12.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function __PRIVATE_isPartialObserver(t) {
    /**
 * Returns true if obj is an object and contains at least one of the specified
 * methods.
 */ return function __PRIVATE_implementsAnyMethods(t, e) {
        if ("object" != typeof t || null === t) return !1;
        const n = t;
        for (const t of e)if (t in n && "function" == typeof n[t]) return !0;
        return !1;
    }(t, [
        "next",
        "error",
        "complete"
    ]);
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Represents an aggregation that can be performed by Firestore.
 */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
class AggregateField {
    /**
     * Create a new AggregateField<T>
     * @param aggregateType - Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath - Optionally specifies the field that is aggregated.
     * @internal
     */ constructor(t = "count", e){
        this._internalFieldPath = e, /** A type string to uniquely identify instances of this class. */ this.type = "AggregateField", this.aggregateType = t;
    }
}
/**
 * The results of executing an aggregation query.
 */ class AggregateQuerySnapshot {
    /** @hideconstructor */ constructor(t, e, n){
        this._userDataWriter = e, this._data = n, /** A type string to uniquely identify instances of this class. */ this.type = "AggregateQuerySnapshot", this.query = t;
    }
    /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */ data() {
        return this._userDataWriter.convertObjectMap(this._data);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the snapshot as a proto value.
     *
     * @returns An `Object` containing all fields in the snapshot.
     */ _fieldsProto() {
        // Return the cloned value to prevent manipulation of the Snapshot's data
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["O"]({
            mapValue: {
                fields: this._data
            }
        }).clone().value.mapValue.fields;
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ class DocumentSnapshot$1 {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */ constructor(t, e, n, r, s){
        this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, this._converter = s;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */ get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */ get ref() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"](this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */ exists() {
        return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */ data() {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const t = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, /* converter= */ null);
                return this._converter.fromFirestore(t);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the document as a proto Value. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */ _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._document?.data.clone().value.mapValue.fields ?? void 0;
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */ // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(t) {
        if (this._document) {
            const e = this._document.data.field((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("DocumentSnapshot.get", t));
            if (null !== e) return this._userDataWriter.convertValue(e);
        }
    }
}
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */ class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */ data() {
        return super.data();
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function __PRIVATE_validateHasExplicitOrderByForLimitToLast(t) {
    if ("L" /* LimitType.Last */  === t.limitType && 0 === t.explicitOrderBy.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */ class AppliableConstraint {
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ class QueryConstraint extends AppliableConstraint {
}
function query(t, e, ...n) {
    let r = [];
    e instanceof AppliableConstraint && r.push(e), r = r.concat(n), function __PRIVATE_validateQueryConstraintArray(t) {
        const e = t.filter((t)=>t instanceof QueryCompositeFilterConstraint).length, n = t.filter((t)=>t instanceof QueryFieldFilterConstraint).length;
        if (e > 1 || e > 0 && n > 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
    }(r);
    for (const e of r)t = e._apply(t);
    return t;
}
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */ class QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */ constructor(t, e, n){
        super(), this._field = t, this._op = e, this._value = n, /** The type of this query constraint */ this.type = "where";
    }
    static _create(t, e, n) {
        return new QueryFieldFilterConstraint(t, e, n);
    }
    _apply(t) {
        const e = this._parse(t);
        return __PRIVATE_validateNewFieldFilter(t._query, e), new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(t._query, e));
    }
    _parse(t) {
        const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(t.firestore), n = function __PRIVATE_newQueryFilter(t, e, n, r, s, a, o) {
            let i;
            if (s.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */  === a || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */  === a) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid Query. You can't perform '${a}' queries on documentId().`);
                if ("in" /* Operator.IN */  === a || "not-in" /* Operator.NOT_IN */  === a) {
                    __PRIVATE_validateDisjunctiveFilterElements(o, a);
                    const e = [];
                    for (const n of o)e.push(__PRIVATE_parseDocumentIdValue(r, t, n));
                    i = {
                        arrayValue: {
                            values: e
                        }
                    };
                } else i = __PRIVATE_parseDocumentIdValue(r, t, o);
            } else "in" /* Operator.IN */  !== a && "not-in" /* Operator.NOT_IN */  !== a && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */  !== a || __PRIVATE_validateDisjunctiveFilterElements(o, a), i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])(n, e, o, /* allowArrays= */ "in" /* Operator.IN */  === a || "not-in" /* Operator.NOT_IN */  === a);
            const u = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["h"].create(s, a, i);
            return u;
        }(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
        return n;
    }
}
/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */ function where(t, e, n) {
    const r = e, s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("where", t);
    return QueryFieldFilterConstraint._create(s, r, n);
}
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */ class QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */ constructor(/** The type of this query constraint */ t, e){
        super(), this.type = t, this._queryConstraints = e;
    }
    static _create(t, e) {
        return new QueryCompositeFilterConstraint(t, e);
    }
    _parse(t) {
        const e = this._queryConstraints.map((e)=>e._parse(t)).filter((t)=>t.getFilters().length > 0);
        return 1 === e.length ? e[0] : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["j"].create(e, this._getOperator());
    }
    _apply(t) {
        const e = this._parse(t);
        return 0 === e.getFilters().length ? t : (function __PRIVATE_validateNewFilter(t, e) {
            let n = t;
            const r = e.getFlattenedFilters();
            for (const t of r)__PRIVATE_validateNewFieldFilter(n, t), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(n, t);
        }(t._query, e), new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(t._query, e)));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return "and" === this.type ? "and" /* CompositeOperator.AND */  : "or" /* CompositeOperator.OR */ ;
    }
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function or(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t)=>__PRIVATE_validateQueryFilterConstraint("or", t)), QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */ , t);
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function and(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t)=>__PRIVATE_validateQueryFilterConstraint("and", t)), QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */ , t);
}
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */ class QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */ constructor(t, e){
        super(), this._field = t, this._direction = e, /** The type of this query constraint */ this.type = "orderBy";
    }
    static _create(t, e) {
        return new QueryOrderByConstraint(t, e);
    }
    _apply(t) {
        const e = function __PRIVATE_newQueryOrderBy(t, e, n) {
            if (null !== t.startAt) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== t.endAt) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            const r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["an"](e, n);
            return r;
        }(t._query, this._field, this._direction);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["k"])(t._query, e));
    }
}
/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */ function orderBy(t, e = "asc") {
    const n = e, r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("orderBy", t);
    return QueryOrderByConstraint._create(r, n);
}
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */ class QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */ constructor(/** The type of this query constraint */ t, e, n){
        super(), this.type = t, this._limit = e, this._limitType = n;
    }
    static _create(t, e, n) {
        return new QueryLimitConstraint(t, e, n);
    }
    _apply(t) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["l"])(t._query, this._limit, this._limitType));
    }
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limit(t) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"])("limit", t), QueryLimitConstraint._create("limit", t, "F" /* LimitType.First */ );
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limitToLast(t) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"])("limitToLast", t), QueryLimitConstraint._create("limitToLast", t, "L" /* LimitType.Last */ );
}
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */ class QueryStartAtConstraint extends QueryConstraint {
    /**
     * @internal
     */ constructor(/** The type of this query constraint */ t, e, n){
        super(), this.type = t, this._docOrFields = e, this._inclusive = n;
    }
    static _create(t, e, n) {
        return new QueryStartAtConstraint(t, e, n);
    }
    _apply(t) {
        const e = __PRIVATE_newQueryBoundFromDocOrFields(t, this.type, this._docOrFields, this._inclusive);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"])(t._query, e));
    }
}
function startAt(...t) {
    return QueryStartAtConstraint._create("startAt", t, /*inclusive=*/ !0);
}
function startAfter(...t) {
    return QueryStartAtConstraint._create("startAfter", t, /*inclusive=*/ !1);
}
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */ class QueryEndAtConstraint extends QueryConstraint {
    /**
     * @internal
     */ constructor(/** The type of this query constraint */ t, e, n){
        super(), this.type = t, this._docOrFields = e, this._inclusive = n;
    }
    static _create(t, e, n) {
        return new QueryEndAtConstraint(t, e, n);
    }
    _apply(t) {
        const e = __PRIVATE_newQueryBoundFromDocOrFields(t, this.type, this._docOrFields, this._inclusive);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t.firestore, t.converter, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["o"])(t._query, e));
    }
}
function endBefore(...t) {
    return QueryEndAtConstraint._create("endBefore", t, /*inclusive=*/ !1);
}
function endAt(...t) {
    return QueryEndAtConstraint._create("endAt", t, /*inclusive=*/ !0);
}
/** Helper function to create a bound from a document or fields */ function __PRIVATE_newQueryBoundFromDocOrFields(t, e, n, r) {
    if (n[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(n[0]), n[0] instanceof DocumentSnapshot$1) return function __PRIVATE_newQueryBoundFromDocument(t, e, n, r, s) {
        if (!r) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n}().`);
        const a = [];
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
        for (const n of (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["q"])(t))if (n.field.isKeyField()) a.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(e, r.key));
        else {
            const t = r.data.field(n.field);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"])(t)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + n.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
            if (null === t) {
                const t = n.field.canonicalString();
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${t}' (used as the orderBy) does not exist.`);
            }
            a.push(t);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"](a, s);
    }(t._query, t.firestore._databaseId, e, n[0]._document, r);
    {
        const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(t.firestore);
        return function __PRIVATE_newQueryBoundFromFields(t, e, n, r, s, a) {
            // Use explicit order by's because it has to match the query the user made
            const o = t.explicitOrderBy;
            if (s.length > o.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
            const i = [];
            for(let a = 0; a < s.length; a++){
                const u = s[a];
                if (o[a].field.isKeyField()) {
                    if ("string" != typeof u) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof u}`);
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])(t) && -1 !== u.indexOf("/")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${u}' contains a slash.`);
                    const n = t.path.child(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["R"].fromString(u));
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"].isDocumentKey(n)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);
                    const s = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"](n);
                    i.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(e, s));
                } else {
                    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])(n, r, u);
                    i.push(t);
                }
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"](i, a);
        }(t._query, t.firestore._databaseId, s, e, n, r);
    }
}
function __PRIVATE_parseDocumentIdValue(t, e, n) {
    if ("string" == typeof (n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(n))) {
        if ("" === n) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])(e) && -1 !== n.indexOf("/")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
        const r = e.path.child(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["R"].fromString(n));
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"].isDocumentKey(r)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(t, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"](r));
    }
    if (n instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(t, n._key);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["w"])(n)}.`);
}
/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function __PRIVATE_validateDisjunctiveFilterElements(t, e) {
    if (!Array.isArray(t) || 0 === t.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}
/**
 * Given an operator, returns the set of operators that cannot be used with it.
 *
 * This is not a comprehensive check, and this function should be removed in the
 * long term. Validations should occur in the Firestore backend.
 *
 * Operators in a query must adhere to the following set of rules:
 * 1. Only one inequality per query.
 * 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
 */ function __PRIVATE_validateNewFieldFilter(t, e) {
    const n = function __PRIVATE_findOpInsideFilters(t, e) {
        for (const n of t)for (const t of n.getFlattenedFilters())if (e.indexOf(t.op) >= 0) return t.op;
        return null;
    }(t.filters, function __PRIVATE_conflictingOps(t) {
        switch(t){
            case "!=" /* Operator.NOT_EQUAL */ :
                return [
                    "!=" /* Operator.NOT_EQUAL */ ,
                    "not-in" /* Operator.NOT_IN */ 
                ];
            case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
            case "in" /* Operator.IN */ :
                return [
                    "not-in" /* Operator.NOT_IN */ 
                ];
            case "not-in" /* Operator.NOT_IN */ :
                return [
                    "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ ,
                    "in" /* Operator.IN */ ,
                    "not-in" /* Operator.NOT_IN */ ,
                    "!=" /* Operator.NOT_EQUAL */ 
                ];
            default:
                return [];
        }
    }(e.op));
    if (null !== n) // Special case when it's a duplicate op to give a slightly clearer error message.
    throw n === e.op ? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`);
}
function __PRIVATE_validateQueryFilterConstraint(t, e) {
    if (!(e instanceof QueryFieldFilterConstraint || e instanceof QueryCompositeFilterConstraint)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Function ${t}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
}
function __PRIVATE_applyFirestoreDataConverter(t, e, n) {
    let r;
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return r = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, r;
}
class __PRIVATE_LiteUserDataWriter extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["A"] {
    constructor(t){
        super(), this.firestore = t;
    }
    convertBytes(t) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["B"](t);
    }
    convertReference(t) {
        const e = this.convertDocumentKey(t, this.firestore._databaseId);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"](this.firestore, /* converter= */ null, e);
    }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to sum across the result set.
 */ function sum(t) {
    return new AggregateField("sum", (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("sum", t));
}
/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to average across the result set.
 */ function average(t) {
    return new AggregateField("avg", (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("average", t));
}
/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */ function count() {
    return new AggregateField("count");
}
/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left - Compare this AggregateField to the `right`.
 * @param right - Compare this AggregateField to the `left`.
 */ function aggregateFieldEqual(t, e) {
    return t instanceof AggregateField && e instanceof AggregateField && t.aggregateType === e.aggregateType && t._internalFieldPath?.canonicalString() === e._internalFieldPath?.canonicalString();
}
/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */ function aggregateQuerySnapshotEqual(t, e) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["x"])(t.query, e.query) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepEqual"])(t.data(), e.data());
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Calculates the number of documents in the result set of the given query
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can
 * count the documents in cases where the result set is prohibitively large to
 * download entirely (thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size is calculated.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */ function getCountFromServer(t) {
    return getAggregateFromServer(t, {
        count: count()
    });
}
/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, are downloaded. This
 * function can perform aggregations of the documents in cases where the result
 * set is prohibitively large to download entirely (thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set is aggregated over.
 * @param aggregateSpec - An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */ function getAggregateFromServer(t, e) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(n), s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["E"])(e, (t, e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ao"](e, t.aggregateType, t._internalFieldPath));
    // Run the aggregation and convert the results
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["G"])(r, t._query, s).then((e)=>/**
 * Converts the core aggregation result to an `AggregateQuerySnapshot`
 * that can be returned to the consumer.
 * @param query
 * @param aggregateResult - Core aggregation result
 * @internal
 */ (function __PRIVATE_convertToAggregateQuerySnapshot(t, e, n) {
            const r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](t), s = new AggregateQuerySnapshot(e, r, n);
            return s;
        })(n, t, e));
}
class __PRIVATE_MemoryLocalCacheImpl {
    constructor(t){
        this.kind = "memory", this._onlineComponentProvider = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ap"].provider, this._offlineComponentProvider = t?.garbageCollector ? t.garbageCollector._offlineComponentProvider : {
            build: ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aq"](void 0)
        };
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}
class __PRIVATE_PersistentLocalCacheImpl {
    constructor(t){
        let e;
        this.kind = "persistent", t?.tabManager ? (t.tabManager._initialize(t), e = t.tabManager) : (e = persistentSingleTabManager(void 0), e._initialize(t)), this._onlineComponentProvider = e._onlineComponentProvider, this._offlineComponentProvider = e._offlineComponentProvider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}
class __PRIVATE_MemoryEagerGarbageCollectorImpl {
    constructor(){
        this.kind = "memoryEager", this._offlineComponentProvider = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ar"].provider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}
class __PRIVATE_MemoryLruGarbageCollectorImpl {
    constructor(t){
        this.kind = "memoryLru", this._offlineComponentProvider = {
            build: ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aq"](t)
        };
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}
/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */ function memoryEagerGarbageCollector() {
    return new __PRIVATE_MemoryEagerGarbageCollectorImpl;
}
/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */ function memoryLruGarbageCollector(t) {
    return new __PRIVATE_MemoryLruGarbageCollectorImpl(t?.cacheSizeBytes);
}
/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */ function memoryLocalCache(t) {
    return new __PRIVATE_MemoryLocalCacheImpl(t);
}
/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */ function persistentLocalCache(t) {
    return new __PRIVATE_PersistentLocalCacheImpl(t);
}
class __PRIVATE_SingleTabManagerImpl {
    constructor(t){
        this.forceOwnership = t, this.kind = "persistentSingleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */ _initialize(t) {
        this._onlineComponentProvider = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ap"].provider, this._offlineComponentProvider = {
            build: (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["as"](e, t?.cacheSizeBytes, this.forceOwnership)
        };
    }
}
class __PRIVATE_MultiTabManagerImpl {
    constructor(){
        this.kind = "PersistentMultipleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */ _initialize(t) {
        this._onlineComponentProvider = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ap"].provider, this._offlineComponentProvider = {
            build: (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["at"](e, t?.cacheSizeBytes)
        };
    }
}
/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings - Configures the created tab manager.
 */ function persistentSingleTabManager(t) {
    return new __PRIVATE_SingleTabManagerImpl(t?.forceOwnership);
}
/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */ function persistentMultipleTabManager() {
    return new __PRIVATE_MultiTabManagerImpl;
}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const zt = "NOT SUPPORTED";
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */ class SnapshotMetadata {
    /** @hideconstructor */ constructor(t, e){
        this.hasPendingWrites = t, this.fromCache = e;
    }
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */ isEqual(t) {
        return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
    }
}
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ class DocumentSnapshot extends DocumentSnapshot$1 {
    /** @hideconstructor protected */ constructor(t, e, n, r, s, a){
        super(t, e, n, r, a), this._firestore = t, this._firestoreImpl = t, this.metadata = s;
    }
    /**
     * Returns whether or not the data exists. True if the document exists.
     */ exists() {
        return super.exists();
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */ data(t = {}) {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const e = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, /* converter= */ null);
                return this._converter.fromFirestore(e, t);
            }
            return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
        }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */ // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(t, e = {}) {
        if (this._document) {
            const n = this._document.data.field((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])("DocumentSnapshot.get", t));
            if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
        }
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
     *
     * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
     * `DocumentSnapshot` has pending writes.
     */ toJSON() {
        if (this.metadata.hasPendingWrites) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
        const t = this._document, e = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (e.type = DocumentSnapshot._jsonSchemaVersion, e.bundle = "", e.bundleSource = "DocumentSnapshot", e.bundleName = this._key.toString(), !t || !t.isValidDocument() || !t.isFoundDocument()) return e;
        this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields, "previous");
        return e.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), e;
    }
}
function documentSnapshotFromJSON(t, e, n) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"])(e, DocumentSnapshot._jsonSchema)) {
        if (e.bundle === zt) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "The provided JSON object was created in a client environment, which is not supported.");
        // Parse the bundle data.
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["J"])(t._databaseId), s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"])(e.bundle, r), a = s.t(), o = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["L"](s.getMetadata(), r);
        for (const t of a)o.o(t);
        // Ensure that we have the correct number of documents in the bundle.
        const i = o.documents;
        if (1 !== i.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Expected bundle data to contain 1 document, but it contains ${i.length} documents.`);
        // Build out the internal document data.
        const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["M"])(r, i[0].document), c = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["R"].fromString(e.bundleName));
        // Return the external facing DocumentSnapshot.
        return new DocumentSnapshot(t, new __PRIVATE_LiteUserDataWriter(t), c, u, new SnapshotMetadata(/* hasPendingWrites= */ !1, /* fromCache= */ !1), n || null);
    }
}
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */ DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string", DocumentSnapshot._jsonSchemaVersion),
    bundleSource: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string", "DocumentSnapshot"),
    bundleName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string"),
    bundle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string")
};
class QueryDocumentSnapshot extends DocumentSnapshot {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */ data(t = {}) {
        return super.data(t);
    }
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */ class QuerySnapshot {
    /** @hideconstructor */ constructor(t, e, n, r){
        this._firestore = t, this._userDataWriter = e, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
    }
    /** An array of all the documents in the `QuerySnapshot`. */ get docs() {
        const t = [];
        return this.forEach((e)=>t.push(e)), t;
    }
    /** The number of documents in the `QuerySnapshot`. */ get size() {
        return this._snapshot.docs.size;
    }
    /** True if there are no documents in the `QuerySnapshot`. */ get empty() {
        return 0 === this.size;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */ forEach(t, e) {
        this._snapshot.docs.forEach((n)=>{
            t.call(e, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
        });
    }
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */ docChanges(t = {}) {
        const e = !!t.includeMetadataChanges;
        if (e && this._snapshot.excludesMetadataChanges) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
        return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */ function __PRIVATE_changesFromSnapshot(t, e) {
            if (t._snapshot.oldDocs.isEmpty()) {
                let e = 0;
                return t._snapshot.docChanges.map((n)=>{
                    const r = new QueryDocumentSnapshot(t._firestore, t._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(t._snapshot.mutatedKeys.has(n.doc.key), t._snapshot.fromCache), t.query.converter);
                    return n.doc, {
                        type: "added",
                        doc: r,
                        oldIndex: -1,
                        newIndex: e++
                    };
                });
            }
            {
                // A `DocumentSet` that is updated incrementally as changes are applied to use
                // to lookup the index of a document.
                let n = t._snapshot.oldDocs;
                return t._snapshot.docChanges.filter((t)=>e || 3 /* ChangeType.Metadata */  !== t.type).map((e)=>{
                    const r = new QueryDocumentSnapshot(t._firestore, t._userDataWriter, e.doc.key, e.doc, new SnapshotMetadata(t._snapshot.mutatedKeys.has(e.doc.key), t._snapshot.fromCache), t.query.converter);
                    let s = -1, a = -1;
                    return 0 /* ChangeType.Added */  !== e.type && (s = n.indexOf(e.doc.key), n = n.delete(e.doc.key)), 1 /* ChangeType.Removed */  !== e.type && (n = n.add(e.doc), a = n.indexOf(e.doc.key)), {
                        type: __PRIVATE_resultChangeType(e.type),
                        doc: r,
                        oldIndex: s,
                        newIndex: a
                    };
                });
            }
        }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
    }
    /**
     * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
     *
     * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
     * `QuerySnapshot` has pending writes.
     */ toJSON() {
        if (this.metadata.hasPendingWrites) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = {};
        t.type = QuerySnapshot._jsonSchemaVersion, t.bundleSource = "QuerySnapshot", t.bundleName = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N"].newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
        const e = [], n = [], r = [];
        return this.docs.forEach((t)=>{
            null !== t._document && (e.push(t._document), n.push(this._userDataWriter.convertObjectMap(t._document.data.value.mapValue.fields, "previous")), r.push(t.ref.path));
        }), t.bundle = (this._firestore, this.query._query, t.bundleName, "NOT SUPPORTED"), t;
    }
}
function querySnapshotFromJSON(t, e, n) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"])(e, QuerySnapshot._jsonSchema)) {
        if (e.bundle === zt) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "The provided JSON object was created in a client environment, which is not supported.");
        // Parse the bundle data.
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["J"])(t._databaseId), s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["K"])(e.bundle, r), a = s.t(), o = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["L"](s.getMetadata(), r);
        for (const t of a)o.o(t);
        if (1 !== o.queries.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `Snapshot data expected 1 query but found ${o.queries.length} queries.`);
        // Create an internal Query object from the named query in the bundle.
        const i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["P"])(o.queries[0].bundledQuery), u = o.documents;
        // Construct the arrays of document data for the query.
        let c = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["S"];
        u.map((t)=>{
            const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["M"])(r, t.document);
            c = c.add(e);
        });
        // Create a view snapshot of the query and documents.
        const l = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["V"].fromInitialDocuments(i, c, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["T"])(), /* fromCache= */ !1, /* hasCachedResults= */ !1), h = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"](t, n || null, i);
        // Create an external Query object, required to construct the QuerySnapshot.
        // Return a new QuerySnapshot with all of the collected data.
        return new QuerySnapshot(t, new __PRIVATE_LiteUserDataWriter(t), h, l);
    }
}
function __PRIVATE_resultChangeType(t) {
    switch(t){
        case 0 /* ChangeType.Added */ :
            return "added";
        case 2 /* ChangeType.Modified */ :
        case 3 /* ChangeType.Metadata */ :
            return "modified";
        case 1 /* ChangeType.Removed */ :
            return "removed";
        default:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"])(61501, {
                type: t
            });
    }
}
// TODO(firestoreexp): Add tests for snapshotEqual with different snapshot
// metadata
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */ function snapshotEqual(t, e) {
    return t instanceof DocumentSnapshot && e instanceof DocumentSnapshot ? t._firestore === e._firestore && t._key.isEqual(e._key) && (null === t._document ? null === e._document : t._document.isEqual(e._document)) && t._converter === e._converter : t instanceof QuerySnapshot && e instanceof QuerySnapshot && t._firestore === e._firestore && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["x"])(t.query, e.query) && t.metadata.isEqual(e.metadata) && t._snapshot.isEqual(e._snapshot);
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string", QuerySnapshot._jsonSchemaVersion),
    bundleSource: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string", "QuerySnapshot"),
    bundleName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string"),
    bundle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"])("string")
};
const Yt = {
    maxAttempts: 5
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */ class WriteBatch {
    /** @hideconstructor */ constructor(t, e){
        this._firestore = t, this._commitHandler = e, this._mutations = [], this._committed = !1, this._dataReader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(t);
    }
    set(t, e, n) {
        this._verifyNotCommitted();
        const r = __PRIVATE_validateReference(t, this._firestore), s = __PRIVATE_applyFirestoreDataConverter(r.converter, e, n), a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["W"])(this._dataReader, "WriteBatch.set", r._key, s, null !== r.converter, n);
        return this._mutations.push(a.toMutation(r._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].none())), this;
    }
    update(t, e, n, ...r) {
        this._verifyNotCommitted();
        const s = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        let a;
        return a = "string" == typeof (e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(e)) || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Y"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Z"])(this._dataReader, "WriteBatch.update", s._key, e, n, r) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["$"])(this._dataReader, "WriteBatch.update", s._key, e), this._mutations.push(a.toMutation(s._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */ delete(t) {
        this._verifyNotCommitted();
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._mutations = this._mutations.concat(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a0"](e._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].none())), this;
    }
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */ commit() {
        return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }
    _verifyNotCommitted() {
        if (this._committed) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
    }
}
function __PRIVATE_validateReference(t, e) {
    if ((t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(t)).firestore !== e) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
    return t;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
// legacy SDK.
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */ class Transaction$1 {
    /** @hideconstructor */ constructor(t, e){
        this._firestore = t, this._transaction = e, this._dataReader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(t);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */ get(t) {
        const e = __PRIVATE_validateReference(t, this._firestore), n = new __PRIVATE_LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([
            e._key
        ]).then((t)=>{
            if (!t || 1 !== t.length) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"])(24041);
            const r = t[0];
            if (r.isFoundDocument()) return new DocumentSnapshot$1(this._firestore, n, r.key, r, e.converter);
            if (r.isNoDocument()) return new DocumentSnapshot$1(this._firestore, n, e._key, null, e.converter);
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"])(18433, {
                doc: r
            });
        });
    }
    set(t, e, n) {
        const r = __PRIVATE_validateReference(t, this._firestore), s = __PRIVATE_applyFirestoreDataConverter(r.converter, e, n), a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["W"])(this._dataReader, "Transaction.set", r._key, s, null !== r.converter, n);
        return this._transaction.set(r._key, a), this;
    }
    update(t, e, n, ...r) {
        const s = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        let a;
        return a = "string" == typeof (e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(e)) || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Y"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Z"])(this._dataReader, "Transaction.update", s._key, e, n, r) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["$"])(this._dataReader, "Transaction.update", s._key, e), this._transaction.update(s._key, a), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */ delete(t) {
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._transaction.delete(e._key), this;
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */ class Transaction extends Transaction$1 {
    // This class implements the same logic as the Transaction API in the Lite SDK
    // but is subclassed in order to return its own DocumentSnapshot types.
    /** @hideconstructor */ constructor(t, e){
        super(t, e), this._firestore = t;
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */ get(t) {
        const e = __PRIVATE_validateReference(t, this._firestore), n = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](this._firestore);
        return super.get(t).then((t)=>new DocumentSnapshot(this._firestore, n, e._key, t._document, new SnapshotMetadata(/* hasPendingWrites= */ !1, /* fromCache= */ !1), e.converter));
    }
}
/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */ function runTransaction(t, e, n) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]);
    const r = {
        ...Yt,
        ...n
    };
    !function __PRIVATE_validateTransactionOptions(t) {
        if (t.maxAttempts < 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Max attempts must be at least 1");
    }(r);
    const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a1"])(s, (n)=>e(new Transaction(t, n)), r);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDoc(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a2"])(n, t._key).then((n)=>__PRIVATE_convertToDocSnapshot(e, t, n));
}
/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDocFromCache(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e), r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a3"])(n, t._key).then((n)=>new DocumentSnapshot(e, r, t._key, n, new SnapshotMetadata(null !== n && n.hasLocalMutations, /* fromCache= */ !0), t.converter));
}
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDocFromServer(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a2"])(n, t._key, {
        source: "server"
    }).then((n)=>__PRIVATE_convertToDocSnapshot(e, t, n));
}
/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocs(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e), r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](e);
    return __PRIVATE_validateHasExplicitOrderByForLimitToLast(t._query), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a4"])(n, t._query).then((n)=>new QuerySnapshot(e, r, t, n));
}
/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocsFromCache(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e), r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a5"])(n, t._query).then((n)=>new QuerySnapshot(e, r, t, n));
}
/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocsFromServer(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"]);
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(e), r = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a4"])(n, t._query, {
        source: "server"
    }).then((n)=>new QuerySnapshot(e, r, t, n));
}
function setDoc(t, e, n) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]);
    const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), s = __PRIVATE_applyFirestoreDataConverter(t.converter, e, n), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(r);
    return executeWrite(r, [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["W"])(o, "setDoc", t._key, s, null !== t.converter, n).toMutation(t._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].none())
    ]);
}
function updateDoc(t, e, n, ...r) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]);
    const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(s);
    let i;
    i = "string" == typeof (// For Compat types, we have to "extract" the underlying types before
    // performing validation.
    e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(e)) || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Y"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Z"])(o, "updateDoc", t._key, e, n, r) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["$"])(o, "updateDoc", t._key, e);
    return executeWrite(s, [
        i.toMutation(t._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].exists(!0))
    ]);
}
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * @param reference - A reference to the document to delete.
 * @returns A Promise resolved once the document has been successfully
 * deleted from the backend (note that it won't resolve while you're offline).
 */ function deleteDoc(t) {
    return executeWrite((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), [
        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a0"](t._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].none())
    ]);
}
/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */ function addDoc(t, e) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a6"])(t), s = __PRIVATE_applyFirestoreDataConverter(t.converter, e), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(t.firestore);
    return executeWrite(n, [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["W"])(o, "addDoc", r._key, s, null !== t.converter, {}).toMutation(r._key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"].exists(!1))
    ]).then(()=>r);
}
function onSnapshot(t, ...e) {
    // onSnapshot for Query or Document.
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(t);
    let n = {
        includeMetadataChanges: !1,
        source: "default"
    }, r = 0;
    "object" != typeof e[r] || __PRIVATE_isPartialObserver(e[r]) || (n = e[r++]);
    const s = {
        includeMetadataChanges: n.includeMetadataChanges,
        source: n.source
    };
    if (__PRIVATE_isPartialObserver(e[r])) {
        const t = e[r];
        e[r] = t.next?.bind(t), e[r + 1] = t.error?.bind(t), e[r + 2] = t.complete?.bind(t);
    }
    let o, i, u;
    if (t instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"]) i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a7"])(t._key.path), o = {
        next: (n)=>{
            e[r] && e[r](__PRIVATE_convertToDocSnapshot(i, t, n));
        },
        error: e[r + 1],
        complete: e[r + 2]
    };
    else {
        const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q"]);
        i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(n.firestore, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), u = n._query;
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](i);
        o = {
            next: (t)=>{
                e[r] && e[r](new QuerySnapshot(i, s, n, t));
            },
            error: e[r + 1],
            complete: e[r + 2]
        }, __PRIVATE_validateHasExplicitOrderByForLimitToLast(t._query);
    }
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(i);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a8"])(c, u, s, o);
}
function onSnapshotResume(t, e, ...n) {
    const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$util$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModularInstance"])(t), s = /**
 * Ensures the data required to construct an {@link onSnapshot} listener exist in a `snapshotJson`
 * object that originates from {@link DocumentSnapshot.toJSON} or {@link Querysnapshot.toJSON}. The
 * data is normalized into a typed object.
 *
 * @param snapshotJson - The JSON object that the app provided to {@link onSnapshot}.
 * @returns A normalized object that contains all of the required bundle JSON fields. If
 * {@link snapshotJson} doesn't contain the required fields, or if the fields exist as empty
 * strings, then the {@link snapshotJson.error} field will be a non empty string.
 *
 * @internal
 */ function __PRIVATE_normalizeSnapshotJsonFields(t) {
        const e = {
            bundle: "",
            bundleName: "",
            bundleSource: ""
        }, n = [
            "bundle",
            "bundleName",
            "bundleSource"
        ];
        for (const r of n){
            if (!(r in t)) {
                e.error = `snapshotJson missing required field: ${r}`;
                break;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const n = t[r];
            if ("string" != typeof n) {
                e.error = `snapshotJson field '${r}' must be a string.`;
                break;
            }
            if (0 === n.length) {
                e.error = `snapshotJson field '${r}' cannot be an empty string.`;
                break;
            }
            "bundle" === r ? e.bundle = n : "bundleName" === r ? e.bundleName = n : "bundleSource" === r && (e.bundleSource = n);
        }
        return e;
    }(e);
    if (s.error) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, s.error);
    let a, o = 0;
    if ("object" != typeof n[o] || __PRIVATE_isPartialObserver(n[o]) || (a = n[o++]), "QuerySnapshot" === s.bundleSource) {
        let t = null;
        if ("object" == typeof n[o] && __PRIVATE_isPartialObserver(n[o])) {
            const e = n[o++];
            t = {
                next: e.next,
                error: e.error,
                complete: e.complete
            };
        } else t = {
            next: n[o++],
            error: n[o++],
            complete: n[o++]
        };
        /**
 * Loads the bundle in a separate task and then invokes {@link onSnapshot} with a
 * {@link Query} that represents the Query in the bundle.
 *
 * @param firestore - The {@link Firestore} instance for the {@link onSnapshot} operation request.
 * @param json - The JSON bundle to load, produced by {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 *
 * @internal
 */ return function __PRIVATE_onSnapshotQuerySnapshotBundle(t, e, n, r, s) {
            let a, o = !1;
            const i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a9"])(t, e.bundle);
            return i.then(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aa"])(t, e.bundleName)).then((t)=>{
                if (t && !o) {
                    s && t.withConverter(s), a = onSnapshot(t, n || {}, r);
                }
            }).catch((t)=>(r.error && r.error(t), ()=>{})), ()=>{
                o || (o = !0, a && a());
            };
        }(r, s, a, t, n[o]);
    }
    if ("DocumentSnapshot" === s.bundleSource) {
        let t = null;
        if ("object" == typeof n[o] && __PRIVATE_isPartialObserver(n[o])) {
            const e = n[o++];
            t = {
                next: e.next,
                error: e.error,
                complete: e.complete
            };
        } else t = {
            next: n[o++],
            error: n[o++],
            complete: n[o++]
        };
        return function __PRIVATE_onSnapshotDocumentSnapshotBundle(t, e, n, r, s) {
            let a, o = !1;
            const i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a9"])(t, e.bundle);
            return i.then(()=>{
                if (!o) {
                    const o = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["D"](t, s || null, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v"].fromPath(e.bundleName));
                    a = onSnapshot(o, n || {}, r);
                }
            }).catch((t)=>(r.error && r.error(t), ()=>{})), ()=>{
                o || (o = !0, a && a());
            };
        }(r, s, a, t, n[o]);
    }
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, `unsupported bundle source: ${s.bundleSource}`);
}
function onSnapshotsInSync(t, e) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]);
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t), r = __PRIVATE_isPartialObserver(e) ? e : {
        next: e
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ab"])(n, r);
}
/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */ function executeWrite(t, e) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ac"])(n, e);
}
/**
 * Converts a {@link ViewSnapshot} that contains the single document specified by `ref`
 * to a {@link DocumentSnapshot}.
 */ function __PRIVATE_convertToDocSnapshot(t, e, n) {
    const r = n.docs.get(e._key), s = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["H"](t);
    return new DocumentSnapshot(t, s, e._key, r, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), e.converter);
}
function writeBatch(t) {
    return t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t), new WriteBatch(t, (e)=>executeWrite(t, e));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function setIndexConfiguration(t, e) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]);
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t);
    if (!n._uninitializedComponentsProvider || "memory" === n._uninitializedComponentsProvider._offline.kind) // PORTING NOTE: We don't return an error if the user has not enabled
    // persistence since `enableIndexeddbPersistence()` can fail on the Web.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ad"])("Cannot enable indexes when persistence is disabled"), Promise.resolve();
    const r = function __PRIVATE_parseIndexes(t) {
        const e = "string" == typeof t ? function __PRIVATE_tryParseJson(t) {
            try {
                return JSON.parse(t);
            } catch (t) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Failed to parse JSON: " + t?.message);
            }
        }(t) : t, n = [];
        if (Array.isArray(e.indexes)) for (const t of e.indexes){
            const e = __PRIVATE_tryGetString(t, "collectionGroup"), r = [];
            if (Array.isArray(t.fields)) for (const e of t.fields){
                const t = __PRIVATE_tryGetString(e, "fieldPath"), n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ae"])("setIndexConfiguration", t);
                "CONTAINS" === e.arrayConfig ? r.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["af"](n, 2 /* IndexKind.CONTAINS */ )) : "ASCENDING" === e.order ? r.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["af"](n, 0 /* IndexKind.ASCENDING */ )) : "DESCENDING" === e.order && r.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["af"](n, 1 /* IndexKind.DESCENDING */ ));
            }
            n.push(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ag"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ag"].UNKNOWN_ID, e, r, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ah"].empty()));
        }
        return n;
    }(e);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ai"])(n, r);
}
function __PRIVATE_tryGetString(t, e) {
    if ("string" != typeof t[e]) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].INVALID_ARGUMENT, "Missing string value for: " + e);
    return t[e];
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * A `PersistentCacheIndexManager` for configuring persistent cache indexes used
 * for local query execution.
 *
 * To use, call `getPersistentCacheIndexManager()` to get an instance.
 */ class PersistentCacheIndexManager {
    /** @hideconstructor */ constructor(t){
        this._firestore = t, /** A type string to uniquely identify instances of this class. */ this.type = "PersistentCacheIndexManager";
    }
}
/**
 * Returns the PersistentCache Index Manager used by the given `Firestore`
 * object.
 *
 * @returns The `PersistentCacheIndexManager` instance, or `null` if local
 * persistent storage is not in use.
 */ function getPersistentCacheIndexManager(t) {
    t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["y"])(t, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]);
    const e = Kt.get(t);
    if (e) return e;
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t);
    if ("persistent" !== n._uninitializedComponentsProvider?._offline.kind) return null;
    const r = new PersistentCacheIndexManager(t);
    return Kt.set(t, r), r;
}
/**
 * Enables the SDK to create persistent cache indexes automatically for local
 * query execution when the SDK believes cache indexes can help improve
 * performance.
 *
 * This feature is disabled by default.
 */ function enablePersistentCacheIndexAutoCreation(t) {
    __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(t, !0);
}
/**
 * Stops creating persistent cache indexes automatically for local query
 * execution. The indexes which have been created by calling
 * `enablePersistentCacheIndexAutoCreation()` still take effect.
 */ function disablePersistentCacheIndexAutoCreation(t) {
    __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(t, !1);
}
/**
 * Removes all persistent cache indexes.
 *
 * Please note this function will also deletes indexes generated by
 * `setIndexConfiguration()`, which is deprecated.
 */ function deleteAllPersistentCacheIndexes(t) {
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t._firestore);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aj"])(e).then((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ak"])("deleting all persistent cache indexes succeeded")).catch((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ad"])("deleting all persistent cache indexes failed", t));
}
function __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(t, e) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"])(t._firestore);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["al"])(n, e).then((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ak"])(`setting persistent cache index auto creation isEnabled=${e} succeeded`)).catch((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ad"])(`setting persistent cache index auto creation isEnabled=${e} failed`, t));
}
/**
 * Maps `Firestore` instances to their corresponding
 * `PersistentCacheIndexManager` instances.
 *
 * Use a `WeakMap` so that the mapping will be automatically dropped when the
 * `Firestore` instance is garbage collected. This emulates a private member
 * as described in https://goo.gle/454yvug.
 */ const Kt = new WeakMap;
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Testing hooks for use by Firestore's integration test suite to reach into the
 * SDK internals to validate logic and behavior that is not visible from the
 * public API surface.
 *
 * @internal
 */ class TestingHooks {
    constructor(){
        throw new Error("instances of this class should not be created");
    }
    /**
     * Registers a callback to be notified when an existence filter mismatch
     * occurs in the Watch listen stream.
     *
     * The relative order in which callbacks are notified is unspecified; do not
     * rely on any particular ordering. If a given callback is registered multiple
     * times then it will be notified multiple times, once per registration.
     *
     * @param callback - the callback to invoke upon existence filter mismatch.
     *
     * @returns a function that, when called, unregisters the given callback; only
     * the first invocation of the returned function does anything; all subsequent
     * invocations do nothing.
     */ static onExistenceFilterMismatch(t) {
        return __PRIVATE_TestingHooksSpiImpl.instance.onExistenceFilterMismatch(t);
    }
}
/**
 * The implementation of `TestingHooksSpi`.
 */ class __PRIVATE_TestingHooksSpiImpl {
    constructor(){
        this.i = new Map;
    }
    static get instance() {
        return Xt || (Xt = new __PRIVATE_TestingHooksSpiImpl, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["am"])(Xt)), Xt;
    }
    u(t) {
        this.i.forEach((e)=>e(t));
    }
    onExistenceFilterMismatch(t) {
        const e = Symbol(), n = this.i;
        return n.set(e, t), ()=>n.delete(e);
    }
}
let Xt = null;
/**
 * Cloud Firestore
 *
 * @packageDocumentation
 */ !function __PRIVATE_registerFirestore(u, l = !0) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SDK_VERSION"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["_registerComponent"])(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$component$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"]("firestore", (t, { instanceIdentifier: e, options: n })=>{
        const r = t.getProvider("app").getImmediate(), s = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"](new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"](t.getProvider("auth-internal")), new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"](r, t.getProvider("app-check-internal")), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$091f2944$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(r, e), r);
        return n = {
            useFetchStreams: l,
            ...n
        }, s._setSettings(n), s;
    }, "PUBLIC").setMultipleInstances(!0)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerVersion"])(Ut, Ht, u), // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerVersion"])(Ut, Ht, "esm2020");
}();
;
 //# sourceMappingURL=index.esm.js.map
}),
]);

//# sourceMappingURL=2374f_%40firebase_firestore_dist_index_esm_3ab031aa.js.map