import { auth, storage } from "./firebase";
import {
    derived,
    writable,
    type Writable
} from "svelte/store";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
    type TaskState
} from "firebase/storage";
import { updateProfile } from "firebase/auth";

type UploadState = {
    progress: number | null;
    state: TaskState | null;
    error: string | null;
    downloadURL: string | null;
}

export const useUploadImage = () => {

    const files = writable<FileList>();

    const status = derived<
        Writable<FileList>,
        UploadState
    >(files, ($files, set) => {

        if (!$files) {
            set({
                progress: null,
                state: null,
                error: null,
                downloadURL: null
            });
            return;
        }

        if (!auth.currentUser) {
            throw 'Not logged in!';
        }

        const uid = auth.currentUser.uid;

        const new_file = $files[0];

        if (new_file.size >= 1 * 1024 * 1024) {
            set({
                progress: null,
                state: null,
                error: 'Image size must be less than 1MB!',
                downloadURL: null
            })
            return;
        }

        const uploadTask = uploadBytesResumable(
            ref(storage, `profiles/${uid}/${new_file.name}`),
            new_file
        );

        uploadTask.on('state_changed',
            (snapshot) => {

                // handle upload progress
                const progress = (
                    snapshot.bytesTransferred / snapshot.totalBytes
                ) * 100;
                set({
                    progress,
                    state: snapshot.state,
                    error: null,
                    downloadURL: null
                });

            },
            (error) => {

                // error handling
                set({
                    progress: null,
                    state: 'error',
                    error: error.message,
                    downloadURL: null
                })
            },
            () => {

                // success, get download URL
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {

                        // delete current image
                        deleteImage().then(() => {
                            if (!auth.currentUser) {
                                throw 'No User!';
                            }
                            // update profile with new image
                            updateProfile(auth.currentUser, {
                                displayName: auth.currentUser.displayName,
                                photoURL: downloadURL
                            }).then(() => {

                                // set progress to 100%
                                set({
                                    progress: 100,
                                    state: 'success',
                                    error: null,
                                    downloadURL
                                });
                            });
                        })


                    });
            }
        );

    });

    return {
        files,
        status
    };
};

export const deleteImage = async () => {
    if (!auth.currentUser) {
        throw 'No User!';
    }

    const photoURL = auth.currentUser.photoURL;

    if (!photoURL) {
        return;
    }

    // update profile with no image
    await updateProfile(auth.currentUser, {
        displayName: auth.currentUser.displayName,
        photoURL: null
    });

    // delete image
    deleteObject(
        ref(storage, photoURL)
    );

};