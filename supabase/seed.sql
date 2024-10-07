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

-- Seed data for projects
INSERT INTO public.projects (owner_id, name, description, image_url, status, data_limit, current_data_usage, file_count, is_full, subscription_id) VALUES
('d7bed82b-3f97-4646-8800-1d1739e8c8f5', 'Unsorted demo', '{"description": "This AI is an expert at hand written text. Contribute your drawings to receive a score."}', '/alpha.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1));
-- ('b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b', 'Project Beta', '{"description": "This is Project Beta"}', 'http://localhost:3000/beta.jpg', 'Proposed', 5368709120, 1073741824, 20, false, (SELECT id FROM public.subscriptions WHERE tier = 'Pro' LIMIT 1), 'projects/beta/'),
-- ('c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f', 'Project Gamma', '{"description": "This is Project Gamma"}', 'http://localhost:3000/gamma.jpg', 'Training', 10737418240, 2147483648, 30, false, (SELECT id FROM public.subscriptions WHERE tier = 'Enterprise' LIMIT 1), 'projects/gamma/');

-- Seed data for project_managers
INSERT INTO public.project_managers (project_id, user_id) VALUES
((SELECT id FROM public.projects WHERE name = 'Project Alpha'), 'b5f9e3a0-5c4d-4c4d-9e6f-e14e4e2e5a6b');
-- ((SELECT id FROM public.projects WHERE name = 'Project Beta'), 'c3d2a1b0-9e8d-7c6b-5a4f-3e2d1c0b9a8f'),
-- ((SELECT id FROM public.projects WHERE name = 'Project Gamma'), 'd7bed82b-3f97-4646-8800-1d1739e8c8f5');


-- Seed data for nonces (optional, as they are typically generated on-demand)
INSERT INTO public.nonces (nonce) VALUES
('abcdef1234567890');
-- ('1234567890abcdef'),
-- ('0987654321fedcba');


