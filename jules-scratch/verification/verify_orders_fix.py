from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Login
        page.goto("http://localhost:8000/login")
        page.get_by_label("Email").fill("customer@rill.com")
        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Log in").click()
        expect(page).to_have_url("http://localhost:8000/products")
        print("Logged in successfully.")

        # Navigate to orders page
        page.goto("http://localhost:8000/orders")
        expect(page).to_have_url("http://localhost:8000/orders")
        print("Navigated to orders page.")

        # Wait for the page to load and take a screenshot of the "All" tab
        page.wait_for_selector("text=Tất cả")
        page.screenshot(path="jules-scratch/verification/orders_all_tab_after_fix.png")
        print("Screenshot of 'All' tab taken.")

        # Click on the "Đang giao" (shipped) tab
        page.get_by_role("tab", name="Đang giao").click()
        # Wait for the content to update - a good way is to wait for the URL to contain the status
        expect(page).to_have_url("http://localhost:8000/orders?status=shipped")
        print("Clicked on 'Shipped' tab.")

        # Take a screenshot of the "Shipped" tab view
        page.screenshot(path="jules-scratch/verification/orders_shipped_tab_after_fix.png")
        print("Screenshot of 'Shipped' tab taken.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_after_fix.png")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
