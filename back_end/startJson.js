import { db } from "./database.js";

async function firstTimeFetch(rep, cardPerPage, userId) {
  if (userId === null) {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ?`,
        [cardPerPage],
      );

      const uploadsMap = new Map();

      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
        SELECT
          u.id AS upload_id,
          u.created_at,
          u.filename,
          c.comment_text,
          usr.username,
          CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
        FROM uploads u
        LEFT JOIN comments c ON c.upload_id = u.id
        LEFT JOIN users usr ON usr.id = c.user_id
        LEFT JOIN likes l ON l.upload_id = u.id AND l.user_id = ?
        ORDER BY u.created_at DESC, c.created_at DESC
        LIMIT ?
        `,
        [userId, cardPerPage],
      );

      const uploadsMap = new Map();

      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
            likedByUser: row.liked ? true : false,
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start with like:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  }
}

async function normalNextFetch(
  rep,
  lastImgCreateTime,
  lastImgId,
  cardPerPage,
  userId,
) {
  if (userId === null) {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      WHERE (u.created_at < ? OR (u.created_at = ? AND u.id < ?))
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ?
    `,
        [lastImgCreateTime, lastImgCreateTime, lastImgId, cardPerPage],
      );

      const uploadsMap = new Map();
      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username,
        CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      LEFT JOIN likes l ON l.upload_id = u.id AND l.user_id = ?
      WHERE (u.created_at < ? OR (u.created_at = ? AND u.id < ?))
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ?
    `,
        [userId, lastImgCreateTime, lastImgCreateTime, lastImgId, cardPerPage],
      );

      const uploadsMap = new Map();
      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
            likedByUser: row.liked ? true : false,
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start with like:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  }
}

async function normalPreviousFetch(
  rep,
  firstImgCreateTime,
  firstImgId,
  cardPerPage,
  userId,
) {
  if (userId === null) {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      WHERE (u.created_at > ? OR (u.created_at = ? AND u.id > ?))
      ORDER BY u.created_at ASC, c.created_at ASC
      LIMIT ?
    `,
        [firstImgCreateTime, firstImgCreateTime, firstImgId, cardPerPage],
      );

      const uploadsMap = new Map();
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const [rows] = await db.execute(
        `
        SELECT
          u.id AS upload_id,
          u.created_at,
          u.filename,
          c.comment_text,
          usr.username,
          CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
        FROM uploads u
        LEFT JOIN comments c ON c.upload_id = u.id
        LEFT JOIN users usr ON usr.id = c.user_id
        LEFT JOIN likes l ON l.upload_id = u.id AND l.user_id = ?
        WHERE (u.created_at > ? OR (u.created_at = ? AND u.id > ?))
        ORDER BY u.created_at ASC, c.created_at ASC
        LIMIT ?
      `,
        [
          userId,
          firstImgCreateTime,
          firstImgCreateTime,
          firstImgId,
          cardPerPage,
        ],
      );

      const uploadsMap = new Map();
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
            likedByUser: row.liked ? true : false,
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start with like:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  }
}

async function lastPageFetch(rep, cardPerPage, userId) {
  if (userId === null) {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const offset = (maxPage - 1) * cardPerPage;
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ? OFFSET ?
    `,
        [cardPerPage, offset.toString()],
      );

      const uploadsMap = new Map();
      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error last page fetch:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const offset = (maxPage - 1) * cardPerPage;
      const [rows] = await db.execute(
        `
      SELECT
        u.id AS upload_id,
        u.created_at,
        u.filename,
        c.comment_text,
        usr.username,
        CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
      FROM uploads u
      LEFT JOIN comments c ON c.upload_id = u.id
      LEFT JOIN users usr ON usr.id = c.user_id
      LEFT JOIN likes l ON l.upload_id = u.id AND l.user_id = ?
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ? OFFSET ?
    `,
        [userId, cardPerPage, offset.toString()],
      );

      const uploadsMap = new Map();
      for (const row of rows) {
        if (!uploadsMap.has(row.upload_id)) {
          uploadsMap.set(row.upload_id, {
            id: row.upload_id,
            createTime: row.created_at,
            maxPage: maxPage,
            src: `/uploads/${row.filename}`,
            comments: [],
            likedByUser: row.liked ? true : false,
          });
        }

        if (row.comment_text) {
          uploadsMap.get(row.upload_id).comments.push({
            name: row.username,
            context: row.comment_text,
          });
        }
      }

      const resultObj = Object.fromEntries(
        Array.from(uploadsMap.values()).map((item, index) => [
          `image${index + 1}`,
          item,
        ]),
      );
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error last page fetch with like:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  }
}

export function createJsonFile(fastify) {
  fastify.get("/start", async (req, rep) => {
    const {
      lastImgCreateTime,
      lastImgId,
      cardPerPage,
      firstImgCreateTime,
      firstImgId,
      status,
    } = req.query;
    if (
      !cardPerPage ||
      isNaN(cardPerPage) ||
      cardPerPage <= 0 ||
      !lastImgCreateTime ||
      !lastImgId
    ) {
      return rep.status(400).send({ error: "Invalid cardPerPage parameter" });
    }
    if (status === "first") {
      return firstTimeFetch(rep, cardPerPage, null);
    } else if (status === "next") {
      return normalNextFetch(
        rep,
        lastImgCreateTime,
        lastImgId,
        cardPerPage,
        null,
      );
    } else if (status === "previous") {
      return normalPreviousFetch(
        rep,
        firstImgCreateTime,
        firstImgId,
        cardPerPage,
        null,
      );
    } else if (status === "last") {
      return lastPageFetch(rep, cardPerPage, null);
    }
  });
  fastify.get(
    "/start_with_like",
    { preHandler: [fastify.authenticate] },
    async (req, rep) => {
      const {
        lastImgCreateTime,
        lastImgId,
        cardPerPage,
        firstImgCreateTime,
        firstImgId,
        status,
      } = req.query;
      const userId = req.user.id;
      if (
        !cardPerPage ||
        isNaN(cardPerPage) ||
        cardPerPage <= 0 ||
        !lastImgCreateTime ||
        !lastImgId
      ) {
        return rep.status(400).send({ error: "Invalid cardPerPage parameter" });
      }
      if (status === "first") {
        return firstTimeFetch(rep, cardPerPage, userId);
      } else if (status === "next") {
        return normalNextFetch(
          rep,
          lastImgCreateTime,
          lastImgId,
          cardPerPage,
          userId,
        );
      } else if (status === "previous") {
        return normalPreviousFetch(
          rep,
          firstImgCreateTime,
          firstImgId,
          cardPerPage,
          userId,
        );
      } else if (status === "last") {
        return lastPageFetch(rep, cardPerPage, userId);
      }
    },
  );
}
