import { useEffect, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Subscribes to a Firestore collection in real time and exposes create/update/delete helpers.
 * `T` should NOT include `id` in the stored document — it's attached from the doc snapshot.
 */
export function useCollection<T extends { id: string }>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = constraints.length ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
        setItems(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  const create = useCallback(
    async (data: Omit<T, "id">) => {
      await addDoc(collection(db, collectionName), data as any);
    },
    [collectionName]
  );

  const update = useCallback(
    async (id: string, data: Partial<Omit<T, "id">>) => {
      await updateDoc(doc(db, collectionName, id), data as any);
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, collectionName, id));
    },
    [collectionName]
  );

  return { items, loading, error, create, update, remove };
}

export { orderBy };
