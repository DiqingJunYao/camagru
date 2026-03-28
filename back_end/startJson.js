import { db } from "./database.js";

async function firstTimeFetch(rep, cardPerPage, username) {
  if (username === null) {
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
      console.log("rows fetched:", rows);

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
      console.log("first time fetch result:", resultObj);
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
  }
}

async function normalNextFetch(
  rep,
  lastImgCreateTime,
  lastImgId,
  cardPerPage,
  username,
) {
  if (username === null) {
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
      console.log("normal fetch result:", resultObj);
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
  }
}

async function normalPreviousFetch(
  rep,
  firstImgCreateTime,
  firstImgId,
  cardPerPage,
  username,
) {
  if (username === null) {
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
      ORDER BY u.created_at DESC, c.created_at DESC
      LIMIT ?
    `,
        [firstImgCreateTime, firstImgCreateTime, firstImgId, cardPerPage],
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
      console.log("normal previous fetch result:", resultObj);
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error start:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
  }
}

async function lastPageFetch(rep, cardPerPage, username) {
  if (username === null) {
    try {
      const [countRows] = await db.execute(
        "SELECT COUNT(*) AS total FROM uploads",
      );
      const totalUploads = countRows[0].total;
      const maxPage = Math.ceil(totalUploads / cardPerPage);
      const offset = (maxPage - 1) * cardPerPage;
      console.log(
        "total uploads:",
        totalUploads,
        "maxPage:",
        maxPage,
        "offset:",
        offset,
      );
      console.log(
        "this is the offset type:",
        typeof offset,
        "this is the cardPerPage type:",
        typeof cardPerPage,
      );
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
      console.log("last page fetch result:", resultObj);
      rep.status(200).send(resultObj);
    } catch (err) {
      console.error("Error last page fetch:", err);
      rep.status(500).send({ error: "Internal Server Error" });
    }
  } else {
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
      console.log("first time fetch");
      return firstTimeFetch(rep, cardPerPage, null);
    } else if (status === "next") {
      console.log("normal next fetch");
      return normalNextFetch(
        rep,
        lastImgCreateTime,
        lastImgId,
        cardPerPage,
        null,
      );
    } else if (status === "previous") {
      console.log("normal previous fetch");
      return normalPreviousFetch(
        rep,
        firstImgCreateTime,
        firstImgId,
        cardPerPage,
        null,
      );
    } else if (status === "last") {
      console.log("last page fetch");
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
      const username = req.user.username;
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
        console.log("first time fetch with like");
        return firstTimeFetch(rep, cardPerPage, username);
      } else if (status === "next") {
        console.log("normal next fetch with like");
        return normalNextFetch(
          rep,
          lastImgCreateTime,
          lastImgId,
          cardPerPage,
          username,
        );
      } else if (status === "previous") {
        console.log("normal previous fetch with like");
        return normalPreviousFetch(
          rep,
          firstImgCreateTime,
          firstImgId,
          cardPerPage,
          username,
        );
      } else if (status === "last") {
        console.log("last page fetch with like");
        return lastPageFetch(rep, cardPerPage, username);
      }
    },
  );
}
