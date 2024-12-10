# # # # from flask import Flask, request, redirect, render_template, session

# # # # # Initialize Flask app
# # # # app = Flask(__name__)
# # # # app.secret_key = 'your_secret_key'  # Replace with a strong secret key for session management

# # # # # Mock admin credentials (replace with database or secure storage in production)
# # # # admin_credentials = {
# # # #     'admin': 'password123'  # Example: username 'admin', password 'password123'
# # # # }

# # # # # Route: Serve the admin login page
# # # # @app.route('/admin-login', methods=['GET'])
# # # # def admin_login_page():
# # # #     # Check if already logged in
# # # #     if session.get('admin_logged_in'):
# # # #         return redirect('/admin-dashboard')  # Redirect to dashboard if already logged in
# # # #     return render_template('admin-login.html')  # Render the login page

# # # # # Route: Handle admin login submission
# # # # @app.route('/admin-login', methods=['POST'])
# # # # def admin_login():
# # # #     username = request.form.get('username')
# # # #     password = request.form.get('password')

# # # #     # Authenticate admin
# # # #     if username in admin_credentials and admin_credentials[username] == password:
# # # #         # Set session to indicate login success
# # # #         session['admin_logged_in'] = True
# # # #         session['admin_username'] = username
# # # #         return redirect('/admin-dashboard')
# # # #     else:
# # # #         # Render login page with error message
# # # #         return render_template('admin-login.html', error="Invalid username or password")

# # # # # Route: Serve the admin dashboard
# # # # @app.route('/admin-dashboard')
# # # # def admin_dashboard():
# # # #     # Check if admin is logged in
# # # #     if not session.get('admin_logged_in'):
# # # #         return redirect('/admin-login')  # Redirect to login if not logged in
# # # #     return render_template('admin-dashboard.html', username=session.get('admin_username'))

# # # # # Route: Admin logout
# # # # @app.route('/admin-logout')
# # # # def admin_logout():
# # # #     # Clear admin session
# # # #     session.pop('admin_logged_in', None)
# # # #     session.pop('admin_username', None)
# # # #     return redirect('/admin-login')  # Redirect to login page

# # # # if __name__ == '__main__':
# # # #     # Run the Flask development server
# # # #     app.run(debug=True)
# # # # from flask import Flask, render_template, request, redirect, session, url_for

# # # # app = Flask(__name__)
# # # # app.secret_key = 'your_secret_key'

# # # # # Mock Admin Credentials
# # # # admin_credentials = {'admin': 'pass123'}

# # # # # Main Login Page Route: Select Admin or Customer and Enter Credentials
# # # # @app.route('/login', methods=['GET', 'POST'])
# # # # def login():
# # # #     if request.method == 'POST':
# # # #         user_type = request.form.get('user_type')
# # # #         username = request.form.get('username')
# # # #         password = request.form.get('password')
        
# # # #         # Handle Admin Login
# # # #         if user_type == 'admin':
# # # #             if username == 'admin' and password == admin_credentials['admin']:
# # # #                 session['user_type'] = 'admin'
# # # #                 session['username'] = username
# # # #                 return redirect(url_for('admin_dashboard'))
# # # #             else:
# # # #                 return render_template('login.html', error="Invalid Admin Credentials")

# # # #         # Handle Customer Login
# # # #         elif user_type == 'customer':
# # # #             # Customers can enter any credentials
# # # #             session['user_type'] = 'customer'
# # # #             session['username'] = username
# # # #             return redirect(url_for('customer_dashboard'))

# # # #     return render_template('login.html')

# # # # # Admin Login Route (Separate Page)
# # # # @app.route('/admin-login', methods=['GET', 'POST'])
# # # # def admin_login():
# # # #     if session.get('user_type') == 'admin':
# # # #         return redirect(url_for('admin_dashboard'))
# # # #     return render_template('admin-login.html')

# # # # # Admin Dashboard
# # # # @app.route('/admin-dashboard')
# # # # def admin_dashboard():
# # # #     if session.get('user_type') != 'admin':
# # # #         return redirect(url_for('login'))
# # # #     return render_template('admin-dashboard.html', username=session.get('username'))

# # # # # Customer Dashboard
# # # # @app.route('/customer-dashboard')
# # # # def customer_dashboard():
# # # #     if session.get('user_type') != 'customer':
# # # #         return redirect(url_for('login'))
# # # #     return render_template('customer-dashboard.html', username=session.get('username'))

# # # # # Admin Options
# # # # @app.route('/inventory')
# # # # def inventory():
# # # #     if session.get('user_type') == 'admin':
# # # #         return render_template('inventory.html')
# # # #     return redirect(url_for('login'))

# # # # @app.route('/orders')
# # # # def orders():
# # # #     if session.get('user_type') == 'admin':
# # # #         return render_template('orders.html')
# # # #     return redirect(url_for('login'))

# # # # @app.route('/customers')
# # # # def customers():
# # # #     if session.get('user_type') == 'admin':
# # # #         return render_template('customers.html')
# # # #     return redirect(url_for('login'))

# # # # # Customer Options
# # # # @app.route('/shopping-cart')
# # # # def shopping_cart():
# # # #     if session.get('user_type') == 'customer':
# # # #         return render_template('shopping-cart.html')
# # # #     return redirect(url_for('login'))

# # # # @app.route('/products')
# # # # def products():
# # # #     if session.get('user_type') == 'customer':
# # # #         return render_template('products.html')
# # # #     return redirect(url_for('login'))

# # # # @app.route('/search')
# # # # def search():
# # # #     if session.get('user_type') == 'customer':
# # # #         return render_template('search.html')
# # # #     return redirect(url_for('login'))

# # # # # Logout Route
# # # # @app.route('/logout')
# # # # def logout():
# # # #     session.clear()
# # # #     return redirect(url_for('login'))

# # # # if __name__ == '__main__':
# # # #     app.run(debug=True)
# # # from flask import Flask, request, redirect, render_template, session

# # # app = Flask(__name__)
# # # app.secret_key = 'your_secret_key'  # Replace with a strong secret key for session management

# # # # Mock admin credentials (replace with database or secure storage in production)
# # # admin_credentials = {
# # #     'admin': 'pass123'  # Example: username 'admin', password 'pass123'
# # # }

# # # # Route: Serve the login page
# # # @app.route('/login', methods=['GET'])
# # # def login_page():
# # #     return render_template('login.html')

# # # # Route: Handle login form submission
# # # @app.route('/login', methods=['POST'])
# # # def login():
# # #     user_type = request.form.get('user_type')  # "admin" or "customer"
# # #     username = request.form.get('username')
# # #     password = request.form.get('password')

# # #     # Admin login logic
# # #     if user_type == 'admin':
# # #         if username == 'admin' and password == admin_credentials.get('admin'):
# # #             session['admin_logged_in'] = True
# # #             session['username'] = username
# # #             return redirect('/admin-dashboard')  # Redirect to admin dashboard
# # #         else:
# # #             return render_template('login.html', error="Invalid admin credentials")

# # #     # Customer login logic
# # #     elif user_type == 'customer':
# # #         # For now, customers can enter any username/password (no validation)
# # #         session['customer_logged_in'] = True
# # #         session['username'] = username
# # #         return redirect('/customer-dashboard')  # Redirect to customer dashboard

# # #     return render_template('login.html', error="Please select a user type")

# # # # Route: Admin dashboard
# # # @app.route('/admin-dashboard')
# # # def admin_dashboard():
# # #     if not session.get('admin_logged_in'):
# # #         return redirect('/login')  # Redirect to login if not logged in
# # #     return render_template('admin-dashboard.html', username=session['username'])

# # # # Route: Customer dashboard
# # # @app.route('/customer-dashboard')
# # # def customer_dashboard():
# # #     if not session.get('customer_logged_in'):
# # #         return redirect('/login')  # Redirect to login if not logged in
# # #     return render_template('customer-dashboard.html', username=session['username'])

# # # # Route: Admin logout
# # # @app.route('/admin-logout')
# # # def admin_logout():
# # #     session.pop('admin_logged_in', None)
# # #     session.pop('username', None)
# # #     return redirect('/login')

# # # # Route: Customer logout
# # # @app.route('/customer-logout')
# # # def customer_logout():
# # #     session.pop('customer_logged_in', None)
# # #     session.pop('username', None)
# # #     return redirect('/login')

# # # if __name__ == '__main__':
# # #     app.run(debug=True)
# # from flask import Flask, request, redirect, render_template, session

# # app = Flask(__name__)
# # app.secret_key = 'your_secret_key'  # Make sure to replace this with a strong secret key for session management

# # # Mock admin credentials (replace with a database or secure storage in production)
# # admin_credentials = {
# #     'admin': 'pass123'  # Example: username 'admin', password 'pass123'
# # }

# # # Route: Serve the login page
# # @app.route('/login', methods=['GET'])
# # def login_page():
# #     return render_template('login.html')

# # # Route: Handle login form submission
# # @app.route('/login', methods=['POST'])
# # def login():
# #     user_type = request.form.get('user_type')  # "admin" or "customer"
# #     username = request.form.get('username')
# #     password = request.form.get('password')

# #     print(f"Login attempt: user_type={user_type}, username={username}, password={password}")  # Debug print

# #     # Admin login logic
# #     if user_type == 'admin':
# #         if username == 'admin' and password == admin_credentials.get('admin'):
# #             session['admin_logged_in'] = True
# #             session['username'] = username
# #             print("Admin logged in successfully")  # Debug print
# #             return redirect('/admin-dashboard')  # Redirect to admin dashboard
# #         else:
# #             print("Invalid admin credentials")  # Debug print
# #             return render_template('login.html', error="Invalid admin credentials")

# #     # Customer login logic
# #     elif user_type == 'customer':
# #         # For now, customers can enter any username/password (no validation)
# #         session['customer_logged_in'] = True
# #         session['username'] = username
# #         print("Customer logged in successfully")  # Debug print
# #         return redirect('/customer-dashboard')  # Redirect to customer dashboard

# #     print("Please select a user type")  # Debug print
# #     return render_template('login.html', error="Please select a user type")

# # # Route: Admin dashboard
# # @app.route('/admin-dashboard')
# # def admin_dashboard():
# #     if not session.get('admin_logged_in'):
# #         return redirect('/login')  # Redirect to login if not logged in
# #     return render_template('admin-dashboard.html', username=session['username'])

# # # Route: Customer dashboard
# # @app.route('/customer-dashboard')
# # def customer_dashboard():
# #     if not session.get('customer_logged_in'):
# #         return redirect('/login')  # Redirect to login if not logged in
# #     return render_template('customer-dashboard.html', username=session['username'])

# # # Route: Admin logout
# # @app.route('/admin-logout')
# # def admin_logout():
# #     session.pop('admin_logged_in', None)
# #     session.pop('username', None)
# #     return redirect('/login')

# # # Route: Customer logout
# # @app.route('/customer-logout')
# # def customer_logout():
# #     session.pop('customer_logged_in', None)
# #     session.pop('username', None)
# #     return redirect('/login')

# # if __name__ == '__main__':
# #     app.run(debug=True)
# from flask import Flask, request, redirect, send_from_directory, session, url_for
# import os

# app = Flask(__name__)
# app.secret_key = 'your_secret_key'  # Replace with a strong secret key

# # Mock admin credentials
# admin_credentials = {
#     'admin': 'pass123'  # Example: username 'admin', password 'pass123'
# }

# # Folder to serve HTML files from (you can adjust this path as needed)
# HTML_FOLDER = os.path.join(app.static_folder, 'html')

# # Route: Serve the login page
# @app.route('/login', methods=['GET'])
# def login_page():
#     return send_from_directory(HTML_FOLDER, 'login.html')

# # Route: Handle login form submission
# @app.route('/login', methods=['POST'])
# def login():
#     user_type = request.form.get('user_type')  # "admin" or "customer"
#     username = request.form.get('username')
#     password = request.form.get('password')

#     # Admin login logic
#     if user_type == 'admin':
#         if username == 'admin' and password == admin_credentials.get('admin'):
#             session['admin_logged_in'] = True
#             session['username'] = username
#             return redirect('/admin-dashboard')  # Redirect to admin dashboard
#         else:
#             return send_from_directory(HTML_FOLDER, 'login.html', error="Invalid admin credentials")

#     # Customer login logic
#     elif user_type == 'customer':
#         # Customers can enter any username/password (no validation)
#         session['customer_logged_in'] = True
#         session['username'] = username
#         return redirect('/customer-dashboard')  # Redirect to customer dashboard

#     return send_from_directory(HTML_FOLDER, 'login.html', error="Please select a user type")

# # Route: Admin dashboard
# @app.route('/admin-dashboard')
# def admin_dashboard():
#     if not session.get('admin_logged_in'):
#         return redirect('/login')  # Redirect to login if not logged in
#     return send_from_directory(HTML_FOLDER, 'admin-dashboard.html')

# # Route: Customer dashboard
# @app.route('/customer-dashboard')
# def customer_dashboard():
#     if not session.get('customer_logged_in'):
#         return redirect('/login')  # Redirect to login if not logged in
#     return send_from_directory(HTML_FOLDER, 'customer-dashboard.html')

# # Route: Admin logout
# @app.route('/admin-logout')
# def admin_logout():
#     session.pop('admin_logged_in', None)
#     session.pop('username', None)
#     return redirect('/login')

# # Route: Customer logout
# @app.route('/customer-logout')
# def customer_logout():
#     session.pop('customer_logged_in', None)
#     session.pop('username', None)
#     return redirect('/login')

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, redirect, send_from_directory, session, url_for
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key

# Mock admin credentials
admin_credentials = {
    'admin': 'pass123'  # Example: username 'admin', password 'pass123'
}

# Folder to serve HTML files from (you can adjust this path as needed)
HTML_FOLDER = os.path.join(app.static_folder, 'html')

# Route: Serve the login page
@app.route('/login', methods=['GET'])
def login_page():
    return send_from_directory(HTML_FOLDER, 'login.html')

# Route: Handle login form submission
@app.route('/login', methods=['POST'])
def login():
    user_type = request.form.get('user_type')  # "admin" or "customer"
    username = request.form.get('username')
    password = request.form.get('password')

    # Admin login logic
    if user_type == 'admin':
        if username == 'admin' and password == admin_credentials.get('admin'):
            session['admin_logged_in'] = True
            session['username'] = username
            return redirect('/admin-dashboard')  # Redirect to admin dashboard
        else:
            return send_from_directory(HTML_FOLDER, 'login.html', error="Invalid admin credentials")

    # Customer login logic
    elif user_type == 'customer':
        # Customers can enter any username/password (no validation)
        session['customer_logged_in'] = True
        session['username'] = username
        return redirect('/customer-dashboard')  # Redirect to customer dashboard

    return send_from_directory(HTML_FOLDER, 'login.html', error="Please select a user type")

# Route: Admin dashboard
@app.route('/admin-dashboard')
def admin_dashboard():
    if not session.get('admin_logged_in'):
        return redirect('/login')  # Redirect to login if not logged in
    return send_from_directory(HTML_FOLDER, 'admin-dashboard.html')

# Route: Customer dashboard
@app.route('/customer-dashboard')
def customer_dashboard():
    if not session.get('customer_logged_in'):
        return redirect('/login')  # Redirect to login if not logged in
    return send_from_directory(HTML_FOLDER, 'customer-dashboard.html')

# Route: Admin logout
@app.route('/admin-logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('username', None)
    return redirect('/login')

# Route: Customer logout
@app.route('/customer-logout')
def customer_logout():
    session.pop('customer_logged_in', None)
    session.pop('username', None)
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True)
