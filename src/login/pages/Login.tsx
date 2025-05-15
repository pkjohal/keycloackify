import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <div className="flex h-screen w-full">
            <div className="w-2/5 bg-teal-800 flex items-center justify-center">
            <img 
                src="" 
                alt="GlueLink Logo" 
                className="w-full h-auto"
            />
            </div>
            
            <div className="w-3/5 bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-medium mb-6">Welcome back!</h2>
                    
                    <div id="kc-form">
                        <div id="kc-form-wrapper">
                            {realm.password && (
                                <form
                                    id="kc-form-login"
                                    onSubmit={() => {
                                        setIsLoginButtonDisabled(true);
                                        return true;
                                    }}
                                    action={url.loginAction}
                                    method="post"
                                >
                                    {!usernameHidden && (
                                        <div className="mb-4">
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                                {!realm.loginWithEmailAllowed
                                                    ? msg("username")
                                                    : !realm.registrationEmailAsUsername
                                                      ? msg("usernameOrEmail")
                                                      : msg("email")}
                                            </label>
                                            <input
                                                tabIndex={2}
                                                id="username"
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                name="username"
                                                defaultValue={login.username ?? ""}
                                                type="text"
                                                autoFocus
                                                autoComplete="username"
                                                placeholder="m.example.com"
                                                aria-invalid={messagesPerField.existsError("username", "password")}
                                            />
                                            {messagesPerField.existsError("username", "password") && (
                                                <span
                                                    id="input-error"
                                                    className={kcClsx("kcInputErrorMessageClass")}
                                                    aria-live="polite"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            {msg("password")}
                                        </label>
                                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                            <input
                                                tabIndex={3}
                                                id="password"
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                aria-invalid={messagesPerField.existsError("username", "password")}
                                            />
                                        </PasswordWrapper>
                                        {usernameHidden && messagesPerField.existsError("username", "password") && (
                                            <span
                                                id="input-error"
                                                className={kcClsx("kcInputErrorMessageClass")}
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="mb-6 flex justify-between items-center">
                                        <div>
                                            {realm.rememberMe && !usernameHidden && (
                                                <div className="flex items-center">
                                                    <input
                                                        tabIndex={5}
                                                        id="rememberMe"
                                                        name="rememberMe"
                                                        type="checkbox"
                                                        defaultChecked={!!login.rememberMe}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor="rememberMe" className="text-sm text-gray-600">
                                                        {msg("rememberMe")}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            {realm.resetPasswordAllowed && (
                                                <span>
                                                    <a 
                                                        tabIndex={6} 
                                                        href={url.loginResetCredentialsUrl}
                                                        className="text-sm text-teal-600 hover:text-teal-800"
                                                    >
                                                        {msg("doForgotPassword")}
                                                    </a>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div id="kc-form-buttons">
                                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                        <input
                                            tabIndex={7}
                                            disabled={isLoginButtonDisabled}
                                            className="w-full bg-black hover:bg-gray-800 text-white p-2 rounded transition-colors"
                                            name="login"
                                            id="kc-login"
                                            type="submit"
                                            value={msgStr("doLogIn")}
                                        />
                                    </div>
                                    
                                    {realm.password && realm.registrationAllowed && !registrationDisabled && (
                                        <div className="mt-6 text-center">
                                            <span className="text-sm text-gray-600">
                                                {msg("noAccount")}{" "}
                                                <a 
                                                    tabIndex={8} 
                                                    href={url.registrationUrl}
                                                    className="text-teal-600 hover:text-teal-800"
                                                >
                                                    {msg("doRegister")}
                                                </a>
                                            </span>
                                        </div>
                                    )}
                                </form>
                            )}
                            
                            {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                                <div id="kc-social-providers" className="mt-6">
                                    <hr className="my-6" />
                                    <h2 className="text-lg font-medium mb-4">{msg("identity-provider-login-label")}</h2>
                                    <ul className="space-y-3">
                                        {social.providers.map(p => (
                                            <li key={p.alias}>
                                                <a
                                                    id={`social-${p.alias}`}
                                                    className="flex items-center w-full justify-center p-2 border border-gray-300 rounded hover:bg-gray-50"
                                                    type="button"
                                                    href={p.loginUrl}
                                                >
                                                    {p.iconClasses && <i className={clsx("mr-2", p.iconClasses)} aria-hidden="true"></i>}
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                                    ></span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

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