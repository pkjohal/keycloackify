import { useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import logo from "../assets/img/logo.png";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    return (
        <div className="flex h-screen w-full">
            <div className="sm:w-2/5 md:w-1/2 lg:w-1/2 flex items-center justify-center" style={{ backgroundColor: "#0B545E" }}>
                <img
                    src={logo}
                    alt="GlueLink Logo"
                    className="w-full h-auto"
                />
            </div>

            <div className="sm:w-3/5 md:w-1/2 lg:w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-medium mb-6">{msg("updatePasswordTitle")}</h2>

                    <form id="kc-passwd-update-form" action={url.loginAction} method="post">
                        <div className="mb-4">
                            <label htmlFor="password-new" className="block text-sm font-medium text-gray-700 mb-1">
                                {msg("passwordNew")}
                            </label>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-new">
                                <input
                                    id="password-new"
                                    name="password-new"
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password-new")}
                                />
                            </PasswordWrapper>
                            {messagesPerField.existsError("password-new") && (
                                <span
                                    id="input-error-password-new"
                                    className={kcClsx("kcInputErrorMessageClass")}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("password-new")),
                                    }}
                                />
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                                {msg("passwordConfirm")}
                            </label>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-confirm">
                                <input
                                    id="password-confirm"
                                    name="password-confirm"
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password-confirm")}
                                />
                            </PasswordWrapper>
                            {messagesPerField.existsError("password-confirm") && (
                                <span
                                    id="input-error-password-confirm"
                                    className={kcClsx("kcInputErrorMessageClass")}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("password-confirm")),
                                    }}
                                />
                            )}
                        </div>

                        <div id="kc-form-buttons">
                            {isAppInitiatedAction && (
                                <div className="mb-4">
                                    <a href={url.loginRestartFlowUrl} className="text-sm text-teal-600 hover:text-teal-800">
                                        {msg("doLogIn")}
                                    </a>
                                </div>
                            )}
                            <input
                                className="w-full bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors"
                                type="submit"
                                value={msgStr("doSubmit")}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer(
        (isPasswordRevealed: boolean) => !isPasswordRevealed,
        false
    );

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);
        assert(passwordInputElement instanceof HTMLInputElement);
        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className="relative">
            {children}
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? "Hide" : "Show"}
            </button>
        </div>
    );
}
