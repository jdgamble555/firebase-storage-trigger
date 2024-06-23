import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut,
    updateProfile,
    type User
} from "firebase/auth";
import { readable, type Subscriber } from "svelte/store";
import { auth, db } from "./firebase";
import { useSharedStore } from "./use-shared";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export const loginWithGoogle = async () =>
    await signInWithPopup(auth, new GoogleAuthProvider());

export const logout = async () => await signOut(auth);

const createUserDoc = async (user: UserType) => {

    // get user doc
    const userDoc = await getDoc(
        doc(db, 'profiles', user.uid)
    );

    // create one if DNE
    if (!userDoc.exists()) {
        await setDoc(doc(db, 'profiles', user.uid), {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            createdAt: serverTimestamp()
        });
    }

    // return user
    return user;
};

const user = (defaultUser: UserType | null = null) =>
    readable<UserType | null>(
        defaultUser,
        (set: Subscriber<UserType | null>) => {
            return onIdTokenChanged(auth, (_user: User | null) => {
                if (!_user) {
                    set(null);
                    return;
                }
                const { displayName, photoURL, uid, email } = _user;

                // create user doc if DNE
                createUserDoc({
                    displayName,
                    photoURL,
                    uid,
                    email
                }).then((_u) => {
                    set(_u);
                });
            });
        }
    );

export const useUser = (defaultUser: UserType | null = null) =>
    useSharedStore('user', user, defaultUser);

export const updateUser = async (
    displayName: string,
    photoURL: string
) => {

    if (!auth.currentUser) {
        return {
            error: 'Not Logged In!'
        };
    }
    try {
        await updateDoc(
            doc(db, 'profiles', auth.currentUser.uid), {
            displayName,
            photoURL
        });

        // Trigger function handles this as fallback
        // but we need to update our session immediately
        await updateProfile(auth.currentUser, {
            displayName,
            photoURL
        });

    } catch (e) {
        if (e instanceof FirebaseError) {
            return {
                error: e.message
            };
        }
    }
    return {};
};