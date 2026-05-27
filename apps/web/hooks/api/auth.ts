import { trpc } from "~/trpc/client";

export function useSignup() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        },
    });

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    };
}

export function useSignin() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        },
    });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    };
}

export function useUser() {
    const {
        data: user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.auth.getLoggedInUserInfo.useQuery();

    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
}

export function useGenerateOTP() {
    return trpc.auth.generateOTP.useMutation();
}

export function useVerifyOTP() {
    const utils = trpc.useUtils();
    return trpc.auth.verifyOTP.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        },
    });
}

export function useForgetPassword() {
    return trpc.auth.forgetPassword.useMutation();
}

export function useResetPassword() {
    return trpc.auth.resetPassword.useMutation();
}

export function useLogout() {
    const utils = trpc.useUtils();
    return trpc.auth.logout.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        },
    });
}
