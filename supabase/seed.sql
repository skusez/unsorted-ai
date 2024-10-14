INSERT INTO "public"."data_types" ("name", "icon_url") VALUES
('App Usage', null),
('Background App Refresh', null),
('Battery Usage', null),
('Bluetooth Connections', null),
('Brightness Settings', null),
('Call History', null),
('Camera Usage', null),
('Cellular Data Usage', null),
('Device Model', null),
('Device Orientation', null),
('Device Storage', null),
('Device Temperature', null),
('Device Unlock Count', null),
('Health', null),
('Installed Apps', null),
('Keyboard Data', null),
('Last Backup Date', null),
('Location', null),
('Microphone Usage', null),
('Motion & Fitness', null),
('Notifications', null),
('Operating System Version', null),
('Screen Time', null),
('Volume Settings', null),
('Wi-Fi Connections', null),
('Language Settings', null),
('Barometer Data', null);

INSERT INTO "public"."device_types" ("name", "icon_url") VALUES
('Desktop', null),
('Gaming Console', null),
('Laptop', null),
('Phone', null),
('Printer', null),
('Smart TV', null),
('Smartwatch', null),
('Tablet', null);

INSERT INTO "public"."devices" ("id", "name", "device_type_id", "icon_url") VALUES
('1', 'iPhone 14', 'Phone', null),
('2', 'Samsung Galaxy S21', 'Phone', null),
('3', 'iPad Pro', 'Tablet', null),
('4', 'MacBook Air', 'Laptop', null),
('5', 'HP OfficeJet Pro', 'Printer', null),
('6', 'Apple Watch Series 7', 'Smartwatch', null),
('7', 'Dell XPS 15', 'Laptop', null),
('8', 'PlayStation 5', 'Gaming Console', null),
('9', 'LG OLED C1', 'Smart TV', null);

INSERT INTO "public"."categories" ("category_name") VALUES
('3D Printing'),
('Advertising'),
('Aerospace'),
('Agriculture'),
('Augmented Reality (AR)'),
('Automotive'),
('Biotechnology'),
('Blockchain'),
('Computer Vision'),
('Construction'),
('Customer Service'),
('Cybersecurity'),
('Digital Marketing'),
('Education'),
('E-learning'),
('Energy and Utilities'),
('Environmental Protection'),
('Fashion and Apparel'),
('Finance and Banking'),
('Food and Beverage'),
('Gaming'),
('Healthcare'),
('Human Resources'),
('Insurance'),
('Internet of Things (IoT)'),
('Legal Services'),
('Manufacturing'),
('Media and Entertainment'),
('Mining'),
('Natural Language Processing'),
('Oil and Gas'),
('Pharmaceuticals'),
('Predictive Analytics'),
('Public Safety'),
('Quantum Computing'),
('Real Estate'),
('Renewable Energy'),
('Research and Development'),
('Retail and E-commerce'),
('Robotics'),
('Smart Cities'),
('Social Media'),
('Space Exploration'),
('Sports and Fitness'),
('Supply Chain Management'),
('Telecommunications'),
('Tourism and Hospitality'),
('Transportation and Logistics'),
('Virtual Reality (VR)'),
('Waste Management');


-- Create the projects bucket
INSERT INTO storage.buckets (id, name, created_at, updated_at) VALUES
('projects', 'projects', NOW(), NOW());

-- Seed data for subscriptions
INSERT INTO public.subscriptions (tier, data_limit, price, file_size_limit) VALUES
('Basic', 1073741824, 9.99, 5242880),
('Pro', 5368709120, 19.99, 10485760),
('Enterprise', 10737418240, 49.99, 26214400);

-- Insert corresponding users into auth.users
INSERT INTO auth.users (id, email) VALUES
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'user1@example.com'),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'user2@example.com'),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'user3@example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed data for profiles
INSERT INTO public.profiles (id, wallet_address, email, token_balance, total_contribution_score, file_count) VALUES
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', '0x1234567890123456789012345678901234567890', 'user1@example.com', 100, 50, 5),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', '0x2345678901234567890123456789012345678901', 'user2@example.com', 200, 75, 8),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', '0x3456789012345678901234567890123456789012', 'user3@example.com', 150, 60, 6);

Seed data for projects
INSERT INTO public.projects (owner_id, name, description, image_url, status, data_limit, current_data_usage, file_count, is_full, subscription_id) VALUES
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Unsorted demo', '{"description": "This AI is an expert at hand written text. Contribute your drawings to receive a score."}', '/alpha.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Smart Watch Biometrics', '{"description": "Uses your wearable device to anonymously track your biometrics for health research."}', '/smartwatch-biometrics.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Urban Mobility Patterns', '{"description": "Analyzes smartphone location data to improve city planning and public transportation."}', '/urban-mobility.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Smart Home Energy Optimization', '{"description": "Collects data from smart home devices to optimize energy consumption and reduce bills."}', '/smart-home-energy.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Gaming Performance Insights', '{"description": "Gathers performance data from gaming consoles to improve game development and user experience."}', '/gaming-insights.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Smartphone Battery Life Study', '{"description": "Analyzes battery usage patterns to develop more efficient smartphone batteries."}', '/battery-study.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'AI-Powered Keyboard Predictions', '{"description": "Improves keyboard prediction algorithms using anonymized typing data."}', '/keyboard-ai.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Smart TV Content Recommendations', '{"description": "Enhances content recommendation systems for smart TVs based on viewing habits."}', '/tv-recommendations.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Printer Ink Usage Optimization', '{"description": "Studies printer usage patterns to improve ink efficiency and reduce waste."}', '/printer-optimization.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Laptop Thermal Performance', '{"description": "Analyzes laptop temperature data to improve cooling systems and performance."}', '/laptop-thermal.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Smartphone Camera Usage Trends', '{"description": "Studies camera usage patterns to enhance smartphone camera features and quality."}', '/camera-trends.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Tablet Productivity Analysis', '{"description": "Examines tablet usage to improve productivity apps and features."}', '/tablet-productivity.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Smart Home Voice Assistant Improvement', '{"description": "Analyzes voice commands to enhance natural language processing in smart home devices."}', '/voice-assistant.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Wearable Device Sleep Tracking', '{"description": "Studies sleep patterns using smartwatch data to improve sleep quality recommendations."}', '/sleep-tracking.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Smartphone App Usage Patterns', '{"description": "Analyzes app usage data to identify trends and improve user experience."}', '/app-usage.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Gaming Console Social Interaction Study', '{"description": "Examines social interactions in online gaming to enhance community features."}', '/gaming-social.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Smart TV Advertising Effectiveness', '{"description": "Analyzes viewer engagement with smart TV ads to improve targeting and relevance."}', '/tv-advertising.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1)),
('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Laptop Battery Longevity Research', '{"description": "Studies laptop battery usage patterns to develop longer-lasting batteries."}', '/laptop-battery.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1)),
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Smartphone Environmental Sensor Data', '{"description": "Collects environmental data from smartphone sensors to map urban air quality."}', '/air-quality.jpg', 'Active', 5368709120, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1)),
('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Wearable Device Fitness Motivation Study', '{"description": "Analyzes fitness data to improve motivation techniques in health apps."}', '/fitness-motivation.jpg', 'Active', 10737418240, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1));

-- Seed data for nonces (optional, as they are typically generated on-demand)
INSERT INTO public.nonces (nonce) VALUES
('abcdef1234567890');

INSERT INTO public.project_categories (project_id, category_id) VALUES
((SELECT id FROM public.projects WHERE name = 'Unsorted demo'), '3D Printing');


-- Insert 5 data types for each project
INSERT INTO public.project_data_types (project_id, data_type_id) VALUES
-- Smart Watch Biometrics
((SELECT id FROM public.projects WHERE name = 'Smart Watch Biometrics'), 'Health'),
((SELECT id FROM public.projects WHERE name = 'Smart Watch Biometrics'), 'Motion & Fitness'),

-- Urban Mobility Patterns
((SELECT id FROM public.projects WHERE name = 'Urban Mobility Patterns'), 'Location'),
((SELECT id FROM public.projects WHERE name = 'Urban Mobility Patterns'), 'Motion & Fitness'),
((SELECT id FROM public.projects WHERE name = 'Urban Mobility Patterns'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Urban Mobility Patterns'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Urban Mobility Patterns'), 'Cellular Data Usage'),

-- Smart Home Energy Optimization
((SELECT id FROM public.projects WHERE name = 'Smart Home Energy Optimization'), 'Device Storage'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Energy Optimization'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Energy Optimization'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Energy Optimization'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Energy Optimization'), 'Battery Usage'),

-- Gaming Performance Insights
((SELECT id FROM public.projects WHERE name = 'Gaming Performance Insights'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Gaming Performance Insights'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Gaming Performance Insights'), 'Device Storage'),
((SELECT id FROM public.projects WHERE name = 'Gaming Performance Insights'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Gaming Performance Insights'), 'Screen Time'),

-- Smartphone Battery Life Study
((SELECT id FROM public.projects WHERE name = 'Smartphone Battery Life Study'), 'Battery Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Battery Life Study'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Battery Life Study'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Battery Life Study'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Battery Life Study'), 'Brightness Settings'),

-- AI-Powered Keyboard Predictions
((SELECT id FROM public.projects WHERE name = 'AI-Powered Keyboard Predictions'), 'Keyboard Data'),
((SELECT id FROM public.projects WHERE name = 'AI-Powered Keyboard Predictions'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'AI-Powered Keyboard Predictions'), 'Language Settings'),
((SELECT id FROM public.projects WHERE name = 'AI-Powered Keyboard Predictions'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'AI-Powered Keyboard Predictions'), 'Operating System Version'),

-- Smart TV Content Recommendations
((SELECT id FROM public.projects WHERE name = 'Smart TV Content Recommendations'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Content Recommendations'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Content Recommendations'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Content Recommendations'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Content Recommendations'), 'Volume Settings'),

-- Printer Ink Usage Optimization
((SELECT id FROM public.projects WHERE name = 'Printer Ink Usage Optimization'), 'Device Storage'),
((SELECT id FROM public.projects WHERE name = 'Printer Ink Usage Optimization'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Printer Ink Usage Optimization'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Printer Ink Usage Optimization'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Printer Ink Usage Optimization'), 'Operating System Version'),

-- Laptop Thermal Performance
((SELECT id FROM public.projects WHERE name = 'Laptop Thermal Performance'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Laptop Thermal Performance'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Laptop Thermal Performance'), 'Battery Usage'),
((SELECT id FROM public.projects WHERE name = 'Laptop Thermal Performance'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Laptop Thermal Performance'), 'Operating System Version'),

-- Smartphone Camera Usage Trends
((SELECT id FROM public.projects WHERE name = 'Smartphone Camera Usage Trends'), 'Camera Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Camera Usage Trends'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Camera Usage Trends'), 'Device Storage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Camera Usage Trends'), 'Location'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Camera Usage Trends'), 'Device Model'),

-- Tablet Productivity Analysis
((SELECT id FROM public.projects WHERE name = 'Tablet Productivity Analysis'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Tablet Productivity Analysis'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Tablet Productivity Analysis'), 'Battery Usage'),
((SELECT id FROM public.projects WHERE name = 'Tablet Productivity Analysis'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Tablet Productivity Analysis'), 'Device Model'),

-- Smart Home Voice Assistant Improvement
((SELECT id FROM public.projects WHERE name = 'Smart Home Voice Assistant Improvement'), 'Microphone Usage'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Voice Assistant Improvement'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Voice Assistant Improvement'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Voice Assistant Improvement'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Smart Home Voice Assistant Improvement'), 'Operating System Version'),

-- Wearable Device Sleep Tracking
((SELECT id FROM public.projects WHERE name = 'Wearable Device Sleep Tracking'), 'Motion & Fitness'),
((SELECT id FROM public.projects WHERE name = 'Wearable Device Sleep Tracking'), 'Health'),

((SELECT id FROM public.projects WHERE name = 'Wearable Device Sleep Tracking'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Wearable Device Sleep Tracking'), 'Battery Usage'),

-- Smartphone App Usage Patterns
((SELECT id FROM public.projects WHERE name = 'Smartphone App Usage Patterns'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone App Usage Patterns'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Smartphone App Usage Patterns'), 'Battery Usage'),
((SELECT id FROM public.projects WHERE name = 'Smartphone App Usage Patterns'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Smartphone App Usage Patterns'), 'Device Model'),

-- Gaming Console Social Interaction Study
((SELECT id FROM public.projects WHERE name = 'Gaming Console Social Interaction Study'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Gaming Console Social Interaction Study'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Gaming Console Social Interaction Study'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Gaming Console Social Interaction Study'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Gaming Console Social Interaction Study'), 'Microphone Usage'),

-- Smart TV Advertising Effectiveness
((SELECT id FROM public.projects WHERE name = 'Smart TV Advertising Effectiveness'), 'Screen Time'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Advertising Effectiveness'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Advertising Effectiveness'), 'Wi-Fi Connections'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Advertising Effectiveness'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Smart TV Advertising Effectiveness'), 'Volume Settings'),

-- Laptop Battery Longevity Research
((SELECT id FROM public.projects WHERE name = 'Laptop Battery Longevity Research'), 'Battery Usage'),
((SELECT id FROM public.projects WHERE name = 'Laptop Battery Longevity Research'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Laptop Battery Longevity Research'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Laptop Battery Longevity Research'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Laptop Battery Longevity Research'), 'Operating System Version'),

-- Smartphone Environmental Sensor Data
((SELECT id FROM public.projects WHERE name = 'Smartphone Environmental Sensor Data'), 'Device Temperature'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Environmental Sensor Data'), 'Location'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Environmental Sensor Data'), 'Barometer Data'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Environmental Sensor Data'), 'Device Model'),
((SELECT id FROM public.projects WHERE name = 'Smartphone Environmental Sensor Data'), 'Wi-Fi Connections'),

-- Wearable Device Fitness Motivation Study
((SELECT id FROM public.projects WHERE name = 'Wearable Device Fitness Motivation Study'), 'Health'),
((SELECT id FROM public.projects WHERE name = 'Wearable Device Fitness Motivation Study'), 'Motion & Fitness'),

((SELECT id FROM public.projects WHERE name = 'Wearable Device Fitness Motivation Study'), 'App Usage'),
((SELECT id FROM public.projects WHERE name = 'Wearable Device Fitness Motivation Study'), 'Device Model');

INSERT INTO public.user_devices (user_id, device_id) VALUES
((SELECT id FROM public.profiles WHERE wallet_address = '0x1234567890123456789012345678901234567890'), (SELECT id FROM public.devices WHERE name = 'iPhone 14')),
((SELECT id FROM public.profiles WHERE wallet_address = '0x2345678901234567890123456789012345678901'), (SELECT id FROM public.devices WHERE name = 'Samsung Galaxy S21')),
((SELECT id FROM public.profiles WHERE wallet_address = '0x3456789012345678901234567890123456789012'), (SELECT id FROM public.devices WHERE name = 'iPad Pro'));




-- unstructured data will be aggregated by user and data type. there will be a column that shows the device id that the data belongs to. 