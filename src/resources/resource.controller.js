import {
  createResource,
  deleteResource,
  editResource,
  getResource,
  getResources,
  likeResource,
  userLikedResource,
} from "./resource.service.js";

export async function createResourceController(req, res) {
  const payload = req.body;

  const resource = await createResource(payload);

  if (resource?.id) {
    return res.status(201).json({
      status: "success",
      message: "created resource successfully",
      resource,
    });
  }

  console.log("new resource", resource);
  return res.status(422).json({
    status: "failed",
    message: resource.error || "Failed to create new resource",
  });
}

export async function getResourcesController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const resources = await getResources(page, limit, req.query.title);

  if (Array.isArray(resources)) {
    return res.status(200).json({
      status: "success",
      message: "fetched resources successfully",
      resources,
      paginationMetaData: { page, limit },
    });
  }

  console.log("fetched resources", resources);
  return res.status(404).json({
    status: "failed",
    message: "Failed to fetch resources",
  });
}

export async function getOneResourceController(req, res) {
  const resourceId = req.params.resourceId;

  const resource = await getResource(resourceId);

  if (resource.id) {
    return res.status(200).json({
      status: "success",
      message: "fetched resource successfully",
      resource,
    });
  }

  console.log("fetched resource", resource);
  return res.status(404).json({
    status: "failed",
    message: "Failed to fetch resource",
  });
}

export async function editResourceController(req, res) {
  const payload = req.body;
  const resourceId = req.params.resourceId;

  const resource = await editResource(resourceId, payload);

  if (resource?.id) {
    return res.status(201).json({
      status: "success",
      message: "updated resource successfully",
      resource,
    });
  }

  console.log("new resource", resource);
  return res.status(422).json({
    status: "failed",
    message: resource.error || "Failed to edit resource",
  });
}

export async function deleteResourceController(req, res) {
  const resourceId = req.params.resourceId;

  const resource = await deleteResource(resourceId);

  if (resource?.id) {
    return res.status(200).json({
      status: "success",
      message: "deleted resource successfully",
      resource,
    });
  }

  console.log("delete resource", resource);
  return res.status(422).json({
    status: "failed",
    message: resource.error || "Failed to delete resource",
  });
}

export async function toggleLikeResourceController(req, res) {
  const resourceId = req.params.resourceId;
  const userId = req.user.id; // or get from auth token

  const like = await likeResource(resourceId, userId);

  if (like?.success) {
    return res.status(200).json({
      status: "success",
      message: `${like.action}ed resource successfully`,
    });
  }

  console.log("like resource", like);
  return res.status(422).json({
    status: "failed",
    message: like.error || "Failed to delete resource",
  });
}

export async function userLikedResourceController(req, res) {
  const resourceId = req.params.resourceId;
  const userId = req.user.id; // or get from auth token

  const likedObj = await userLikedResource(resourceId, userId);

  if ("liked" in likedObj) {
    return res.status(200).json({
      status: "success",
      message: `fetched user liked resource info successfully`,
      ...likedObj,
    });
  }

  console.log("user like resource", likedObj);

  return res.status(400).json({
    status: "failed",
    message: likedObj.error || "Failed to fetch user liked resource info",
  });
}
