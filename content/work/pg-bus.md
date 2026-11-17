+++
title = "pg-bus"
description = "A PostgreSQL message bus with transactional publishing, resumable subscriptions, and server-sent events."
weight = 100

[taxonomies]
tags = ["Infrastructure", "Developer tools"]

[extra]
featured = false
kind = "Rust library"
status = "Open source"
repository = "https://github.com/ducks/pg-bus"
website = ""
+++

Messages are published inside the caller’s transaction and subscribers can resume from a cursor. See the repository for operational requirements and limits, including the effect of long-running transactions.
