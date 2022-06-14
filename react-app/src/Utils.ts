export class Utils {
    public static shouldCreateSessions(): boolean {
        const noSessionsFlag = new URLSearchParams(window.location.search).get('noSessions');

        if (noSessionsFlag && noSessionsFlag.toLowerCase() === 'true') {
            return false;
        }

        return true;
    }

    public static shouldNavigateToNextStep(): boolean {
        const noFlowFlag = new URLSearchParams(window.location.search).get('noFlow');

        if (noFlowFlag && noFlowFlag.toLowerCase() === 'true') {
            return false;
        }

        return true;
    }

}