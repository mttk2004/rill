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

        # Wait for the page to load
        page.wait_for_selector("text=Lịch sử mua hàng")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/orders_page.png")
        print("Screenshot taken.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
