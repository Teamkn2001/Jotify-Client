import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useDocumentStore = create(
  persist(
    (set) => ({
      // fetch documents when enter editor page
      getDoc: async (docId, token) => {
        const rs = await axios.get(`http://localhost:8200/user/getDocument/${docId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return rs.data
      },
    }),
    {
      name: "document-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDocumentStore;
