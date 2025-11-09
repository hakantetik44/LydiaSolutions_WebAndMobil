import { OS } from '../utils/OS';

export class BasePage {
    protected driver: WebdriverIO.Browser;

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }

    /** Try an immediate click with no waiting. Returns true on success. */
    public async clickNow(selector: string): Promise<boolean> {
        try {
            const el = await this.driver.$(selector);
            if (await el.isExisting() && await el.isDisplayed()) {
                await el.click();
                return true;
            }
        } catch { /* ignore */ }
        return false;
    }

    /** Try an immediate type with no waiting. Returns true on success. */
    public async typeNow(selector: string, text: string, clearFirst: boolean = true): Promise<boolean> {
        try {
            const el = await this.driver.$(selector);
            if (await el.isExisting() && await el.isDisplayed()) {
                if (clearFirst) { try { await el.clearValue(); } catch { /* ignore */ } }
                await el.setValue(text);
                await this.hideKeyboard();
                return true;
            }
        } catch { /* ignore */ }
        return false;
    }

    /** Wait dynamically for a condition to be true (aggressive polling) */
    protected async waitForCondition(checkFn: () => boolean | Promise<boolean>): Promise<void> {
        const timeout = 30000;
        const start = Date.now();
        while (!(await checkFn())) {
            if (Date.now() - start > timeout) {
                throw new Error("Condition not met within timeout");
            }
            await new Promise(res => setTimeout(res, 5));
        }
    }

    protected async click(selector: string): Promise<void> {
        const el = await this.waitForElement(selector);
        await el.click();
    }

    protected async sendKeys(selector: string, text: string): Promise<void> {
        const el = await this.waitForElement(selector);
        try { await el.clearValue(); } catch { /* ignore */ }
        await el.setValue(text);
    }

    protected async isElementPresent(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isExisting();
        } catch { return false; }
    }

    protected async hideKeyboard(): Promise<void> {
        try {
            if (OS.isAndroid()) {
                try { await this.driver.hideKeyboard(); } catch { await this.driver.back(); }
            } else {
                try { await this.driver.hideKeyboard(); } catch { /* ignore */ }
            }
        } catch { /* ignore */ }
    }

    public async pause(ms: number): Promise<void> {
        if (this.driver) {
            await this.driver.pause(ms);
        } else {
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    protected async clickWithLog(selector: string, elementName: string): Promise<void> {
        await this.click(selector);
    }

    /** Dynamically wait for an element to exist & be displayed (aggressive, max 5s by default) */
    protected async waitForElement(selector: string, maxSeconds: number = 30) {
        if (!this.driver) throw new Error('Driver not initialized');
        const timeoutMs = maxSeconds * 1000;
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            try {
                const el = await this.driver.$(selector);
                if (await el.isExisting() && await el.isDisplayed()) {
                    return el;
                }
            } catch { /* ignore */ }
            await new Promise(res => setTimeout(res, 5));
        }
        throw new Error(`Element not visible after ${maxSeconds}s: ${selector}`);
    }

    /** Wait for element then click immediately when available */
    protected async waitAndClick(selector: string, maxSeconds: number = 30): Promise<void> {
        const el = await this.waitForElement(selector, maxSeconds);
        await el.click();
    }

    /** Wait for element then type text immediately when available */
    protected async waitAndType(selector: string, text: string, clearFirst: boolean = true, maxSeconds: number = 30): Promise<void> {
        const el = await this.waitForElement(selector, maxSeconds);
        if (clearFirst) { try { await el.clearValue(); } catch { /* ignore */ } }
        await el.setValue(text);
        await this.hideKeyboard();
    }

    // ==================== COMMON GESTURES (SWIPE & SCROLL) ====================

    /**
     * Perform horizontal swipe gesture (left to right or right to left)
     * @param direction - 'left' or 'right'
     * @param duration - Duration of swipe in ms (default: 500)
     */
    protected async swipeHorizontal(direction: 'left' | 'right' = 'left', duration: number = 500): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        try {
            const size = await this.driver.getWindowSize();
            const y = Math.floor(size.height * 0.5);
            let startX: number, endX: number;
            if (direction === 'left') { startX = Math.floor(size.width * 0.8); endX = Math.floor(size.width * 0.2); }
            else { startX = Math.floor(size.width * 0.2); endX = Math.floor(size.width * 0.8); }
            await this.driver.performActions([{ type: 'pointer', id: 'finger1', parameters: { pointerType: 'touch' }, actions: [ { type: 'pointerMove', duration: 0, x: startX, y }, { type: 'pointerDown', button: 0 }, { type: 'pointerMove', duration, x: endX, y }, { type: 'pointerUp', button: 0 } ] }]);
        } catch { return; }
    }

    /**
     * Perform vertical scroll gesture (up or down)
     * @param direction - 'up' or 'down'
     * @param duration - Duration of scroll in ms (default: 600)
     */
    protected async scrollVertical(direction: 'up' | 'down' = 'down', duration: number = 600): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        const size = await this.driver.getWindowSize();
        const x = Math.floor(size.width * 0.5);
        let startY: number, endY: number;
        if (direction === 'down') { startY = Math.floor(size.height * 0.8); endY = Math.floor(size.height * 0.2); }
        else { startY = Math.floor(size.height * 0.2); endY = Math.floor(size.height * 0.8); }
        await this.driver.performActions([{ type: 'pointer', id: 'finger1', parameters: { pointerType: 'touch' }, actions: [ { type: 'pointerMove', duration: 0, x, y: startY }, { type: 'pointerDown', button: 0 }, { type: 'pointerMove', duration, x, y: endY }, { type: 'pointerUp', button: 0 } ] }]);
    }

    /**
     * Scroll until element is found or max attempts reached
     * @param selector - Element selector to find
     * @param maxAttempts - Maximum scroll attempts (default: 10)
     * @param direction - Scroll direction (default: 'down')
     * @returns true if element found, false otherwise
     */
    protected async scrollToElement(selector: string, maxAttempts: number = 10, direction: 'up' | 'down' = 'down'): Promise<boolean> {
        if (!this.driver) throw new Error('Driver not initialized');
        let found = await this.isElementPresent(selector);
        let attempts = 0;
        while (!found && attempts < maxAttempts) {
            await this.scrollVertical(direction);
            found = await this.isElementPresent(selector);
            attempts++;
        }
        return found;
    }

    /**
     * Scroll multiple times in a direction (NO PAUSES - maximum speed)
     */
    protected async scrollMultipleTimes(times: number, direction: 'up' | 'down' = 'down', duration: number = 700): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        for (let i = 0; i < times; i++) { try { await this.scrollVertical(direction, duration); } catch { /* ignore */ } }
    }

    /**
     * Scroll until the given selector becomes visible or attempts exhausted.
     * Returns true if found.
     */
    protected async scrollUntilVisible(selector: string, direction: 'up'|'down' = 'down', maxAttempts: number = 60, gestureDuration: number = 350): Promise<boolean> {
        if (!this.driver) throw new Error('Driver not initialized');
        for (let i = 0; i < maxAttempts; i++) {
            if (await this.isElementPresent(selector)) return true;
            await this.scrollVertical(direction, gestureDuration);
        }
        return await this.isElementPresent(selector);
    }

    /**
     * Scroll to bottom (reverted to original simple implementation)
     */
    protected async scrollToBottom(): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        const scrollTimes = 35;
        const scrollDuration = 400;
        for (let i = 0; i < scrollTimes; i++) {
            try { await this.scrollVertical('down', scrollDuration); } catch { /* ignore */ }
        }
    }

    /**
     * Try to close popup by trying multiple close button selectors (fast)
     */
    protected async closePopup(closeButtonSelectors: string[]): Promise<boolean> {
        if (!this.driver) throw new Error('Driver not initialized');
        for (const selector of closeButtonSelectors) {
            try { const element = await this.driver.$(selector); if (await element.isExisting()) { await element.click(); return true; } } catch { continue; }
        }
        return false;
    }

    /**
     * Click on element (no fixed wait afterwards)
     */
    protected async clickAndWait(selector: string, elementName: string): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        await this.clickWithLog(selector, elementName);
    }

    /**
     * Perform multiple swipes (carousel navigation - NO PAUSES)
     */
    protected async swipeMultipleTimes(times: number, direction: 'left' | 'right' = 'left'): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        const swipeDuration = 300;
        for (let i = 0; i < times; i++) { try { await this.swipeHorizontal(direction, swipeDuration); } catch { /* ignore */ } }
    }

    /**
     * Wait for navigation to complete
     * Generic implementation: wait until page source or Android activity changes
     */
    protected async waitForNavigation(): Promise<void> {
        if (!this.driver) throw new Error('Driver not initialized');
        try {
            if ((this.driver as any).getCurrentActivity) {
                const getAct = async () => (this.driver as any).getCurrentActivity();
                const startAct = await getAct();
                await this.waitForCondition(async () => { try { const cur = await getAct(); return cur !== startAct; } catch { return false; } });
                return;
            }
            const startSrc = await this.driver.getPageSource();
            await this.waitForCondition(async () => { try { const src = await this.driver.getPageSource(); return src !== startSrc; } catch { return false; } });
        } catch { return; }
    }

    /**
     * Try to click the selector, return true on success, false on any error.
     * Uses waitAndClick under the hood so it waits dynamically up to maxSeconds.
     */
    public async safeClick(selector: string, maxSeconds: number = 30): Promise<boolean> {
        try { await this.waitAndClick(selector, maxSeconds); return true; } catch { return false; }
    }

    /**
     * Double click on a selector (click twice quickly)
     */
    public async doubleClick(selector: string, maxSeconds: number = 30): Promise<boolean> {
        try { await this.waitAndClick(selector, maxSeconds); await this.waitAndClick(selector, maxSeconds); return true; } catch { return false; }
    }

    /**
     * Try to type into a selector, return true on success, false on any error.
     */
    public async safeType(selector: string, text: string, clearFirst: boolean = true, maxSeconds: number = 30): Promise<boolean> {
        try { await this.waitAndType(selector, text, clearFirst, maxSeconds); return true; } catch { return false; }
    }

    /**
     * Try primary selector, if fails then try fallback selector.
     * Returns the selector that succeeded ('primary'|'fallback'|null)
     */
    public async clickWithFallback(primary: string, fallback: string | null, maxSecondsPrimary?: number, maxSecondsFallback?: number): Promise<'primary'|'fallback'|null> {
        if (await this.safeClick(primary, maxSecondsPrimary)) return 'primary';
        if (fallback && await this.safeClick(fallback, maxSecondsFallback)) return 'fallback';
        return null;
    }

    public async switchToNewWindowOrContext(timeoutMs: number = 7000): Promise<boolean> {
        if (!this.driver) throw new Error('Driver not initialized');
        const start = Date.now();
        let baseHandles: string[] = [];
        let baseContexts: string[] = [];
        try { baseHandles = typeof (this.driver as any).getWindowHandles === 'function' ? await (this.driver as any).getWindowHandles() : []; } catch { baseHandles = []; }
        try { baseContexts = typeof (this.driver as any).getContexts === 'function' ? await (this.driver as any).getContexts() : []; } catch { baseContexts = []; }
        while (Date.now() - start < timeoutMs) {
            try {
                if (typeof (this.driver as any).getWindowHandles === 'function') {
                    const handles: string[] = await (this.driver as any).getWindowHandles();
                    const newest = handles.find(h => !baseHandles.includes(h));
                    if (newest) {
                        if (typeof (this.driver as any).switchToWindow === 'function') {
                            await (this.driver as any).switchToWindow(newest);
                        } else if (typeof (this.driver as any).switchWindow === 'function') {
                            await (this.driver as any).switchWindow(newest);
                        }
                        return true;
                    }
                }
            } catch { /* ignore */ }
            try {
                if (typeof (this.driver as any).getContexts === 'function') {
                    const ctxs: string[] = await (this.driver as any).getContexts();
                    const newestCtx = ctxs.find(c => !baseContexts.includes(c));
                    if (newestCtx && typeof (this.driver as any).switchContext === 'function') {
                        await (this.driver as any).switchContext(newestCtx);
                        return true;
                    }
                }
            } catch { /* ignore */ }
            await new Promise(r => setTimeout(r, 150));
        }
        return false;
    }
}
