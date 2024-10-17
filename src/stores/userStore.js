import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import ResetPassword from "../components/ResetPassword";

const useUserStore = create(
  persist(
    (set) => ({
      documents: [],
      user: null,
      token: "",
      currentDocumentId: "",
      savedVersions : null ,
      userPermissions : null ,
      register: async (body) => {
        const rs = await axios.post(
          "http://localhost:8200/auth/register",
          body
        );
      },
      login: async (body) => {
        const rs = await axios.post("http://localhost:8200/auth/login", body);
        // console.log(rs.data)
        set({ user: rs.data.userData, token: rs.data.token });
      },
      logout: () => {
        set({ user: null, token: "" });
      },
      getAllDoc: async (userId, token) => {
        const rs = await axios.get(`http://localhost:8200/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ documents: rs.data.allDocuments });
        // console.log(rs.data.allDocuments)
      },
      // state of doc
      setCurrentDoc: (doc) => {
        set({ currentDocumentId: doc });
      },
      clearCurrentDoc: () => {
        set({ currentDocumentId: "" });
      },
      //-----------------user profile part and doc manage----------
      getFilteredDoc: async (userId, searchTitle, token) => {
        // console.log(userId, searchTitle, token)
        const rs = await axios.get(
          `http://localhost:8200/user/${userId}/filter?searchTitle=${searchTitle}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ documents: rs.data.allFilteredDocs });
      },
      editProfile: async (userId, body, token) => {
        console.log("in store data = ", userId, body, token);
        for (let key of body.entries()) {
            console.log(key[0] + ':', key[1]);
        }
        const rs = await axios.patch(
          `http://localhost:8200/user/profile/editProfile/${userId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      },
      resetPassword: async (userId, body, token) => {
        console.log(userId, body, token);
        const rs = await axios.patch(
          `http://localhost:8200/user/profile/resetPassword/${userId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      },

      // --------------document part------------------------
      createDoc: async (userId, token) => {
        // console.log("inxxxxxxxxxxxxxxx", userId, token)
        const rs = await axios.post(
          `http://localhost:8200/user/createDocument/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set(()=>({ currentDocumentId: rs.data.pageData.id }));
        console.log("1",rs.data)
      },
      updateDoc: async (documentId, body, token) => {
        console.log("upd Doc sto", documentId, body, token);
        const rs = await axios.patch(
          `http://localhost:8200/user/document/updateDocument/${documentId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      },
      updateTitle: async (documentId, title, token) => {
        console.log("ping pong ~ saved")
        const rs = await axios.patch(
          `http://localhost:8200/user/document/updateTitle/${documentId}`,
          title,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      },
      deleteDoc: async (documentId, token) => {
        console.log("delete exe in store")
        console.log("exe in store",documentId, token);
        const rs = await axios.delete(
          `http://localhost:8200/user/document/deleteDocument/${documentId}`,{
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      },
      // -------------Permission part ------------------
      addOwnerPermission : async ( body, token) => {
        const rs = await axios.post(`http://localhost:8200/user/document/addOwnerPermission`, body , {
          headers: { Authorization: `Bearer ${token}` },
        } )
      },
      givePermission : async ( documentId, permissionInfo, token ) => {
        const rs = await axios.post(`http://localhost:8200/user/document/givePermission/${documentId}`, permissionInfo, {
          headers: { Authorization: `Bearer ${token}` },
        })
      },
      getAllUserPermission : async ( documentId , token) => {
        const rs = await axios.get(`http://localhost:8200/user/document/getAllUserPermission/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        set({userPermissions : rs.data.getAllUserPermission })
      },
      deletePermission : async (permissionId , token) => {
        console.log("permissionId in store", permissionId)
        const rs = await axios.delete(`http://localhost:8200/user/document/deletePermission/${permissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      },

      // -------------comment part ----------------------

      // -------------version part ----------------------
      saveBackupVersion : async ( documentId, body, token) => {
        console.log("backup",  documentId, body, token)
        const rs = await axios.post(`http://localhost:8200/user//document/saveBackupVersion/${documentId}`, body , {
          headers: { Authorization: `Bearer ${token}` },
        })
      },
      getVersionDoc : async (documentId, token) => {
        const rs = await axios.get(`http://localhost:8200/user/document/getVersionDoc/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // console.log(rs.data.saveBackup)
        set( {savedVersions : rs.data.saveBackup})
      }

    }),
    {
      name: "store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
