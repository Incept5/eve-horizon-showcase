# Eve Horizon Showcase

## Secrets

Project secrets are stored in `env.secrets` (gitignored). Import them into Eve with:

```bash
eve secrets import --file env.secrets --project proj_01kh3b8mdaeh49z467vdgccvys
```

## Eve Project (Staging)

- **Project ID:** proj_01kh3b8mdaeh49z467vdgccvys
- **Org:** org_01kfzn79b5fvj8jtgr8stn66gh (Incept5)
- **Slug:** evshow
- **Staging env:** env_01kh3b90g6eh49z47n0262nv3m
- **URL:** https://web.incept5-evshow-staging.eh1.incept5.dev
- **Profile:** staging (api: https://api.eh1.incept5.dev)

## Deploy

```bash
eve profile use staging
eve env deploy staging --ref main --repo-dir .
```
