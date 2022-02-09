/**
 * Initialize the SDK on page load
 */
document.addEventListener("DOMContentLoaded", function(event) {
    acmeSdk.AcmeSdk.initialize({
        postBaseUrl: 'https://localhost:3100',
        authUsername: 'post',
        authPassword: 'password',
        bundleCreated,
    });
});

const record = () => {
    acmeSdk.AcmeSdk.record();
};

const bundleCreated = (session, bundleId) => {
    console.log('bundle created', bundleId);
    const emptyText = document.getElementById('empty-text');
    if (emptyText) {
        emptyText.parentElement.removeChild(emptyText);
    }

    const list = document.getElementById('session-list');
    const item = document.createElement('li');
    item.innerHTML = `Session Id <b>${session.id}</b> added Bundle Id <b>${bundleId}</b>`;
    list.appendChild(item);
};