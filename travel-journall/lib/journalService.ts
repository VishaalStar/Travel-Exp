import { db, storage } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { JournalEntry, Comment } from "@/types/journal"

export const addJournal = async (
  journalData: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "likes" | "comments">,
  userId: string,
) => {
  try {
    const docRef = await addDoc(collection(db, "journals"), {
      ...journalData,
      userId,
      likes: [],
      comments: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding journal:", error)
    throw error
  }
}

export const getJournals = async (userId?: string) => {
  try {
    let q = query(collection(db, "journals"), orderBy("createdAt", "desc"))
    if (userId) {
      q = query(q, where("userId", "==", userId))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as JournalEntry)
  } catch (error) {
    console.error("Error getting journals:", error)
    throw error
  }
}

export const searchJournals = async (searchTerm: string) => {
  try {
    const q = query(collection(db, "journals"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as JournalEntry)
      .filter(
        (entry) =>
          entry.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.location.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
  } catch (error) {
    console.error("Error searching journals:", error)
    throw error
  }
}

export const likeJournal = async (journalId: string, userId: string) => {
  try {
    const journalRef = doc(db, "journals", journalId)
    await updateDoc(journalRef, {
      likes: arrayUnion(userId),
    })
  } catch (error) {
    console.error("Error liking journal:", error)
    throw error
  }
}

export const unlikeJournal = async (journalId: string, userId: string) => {
  try {
    const journalRef = doc(db, "journals", journalId)
    await updateDoc(journalRef, {
      likes: arrayRemove(userId),
    })
  } catch (error) {
    console.error("Error unliking journal:", error)
    throw error
  }
}

export const addComment = async (journalId: string, comment: Omit<Comment, "id" | "createdAt">) => {
  try {
    const journalRef = doc(db, "journals", journalId)
    const newComment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: Timestamp.now(),
    }
    await updateDoc(journalRef, {
      comments: arrayUnion(newComment),
    })
    return newComment
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

export const uploadImage = async (file: File, userId: string) => {
  try {
    const storageRef = ref(storage, `journal_images/${userId}/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

