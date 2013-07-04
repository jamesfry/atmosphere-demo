package resources;

import javax.annotation.ManagedBean;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;

@Path("/notifications")
@ManagedBean
public class NotificationsResource {

	private static final String MAGIC_STRING_FOR_ATMOSPHERE_TO_REPLACE = "";

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	// @Suspend(contentType = "application/json")
	public String subscribe(final @Context HttpServletRequest req) {

		BroadcasterFactory broadcasterFactory = BroadcasterFactory.getDefault();
		Broadcaster userBroadcaster = broadcasterFactory.lookup("userid", true);

		AtmosphereResource resource = (AtmosphereResource) req.getAttribute(AtmosphereResource.class.getName());
		userBroadcaster.addAtmosphereResource(resource);

		resource.resumeOnBroadcast(true);
		resource.suspend();

		/*
		 * Atmosphere will replace any magic String return value here with the
		 * broadcasted message
		 */
		return MAGIC_STRING_FOR_ATMOSPHERE_TO_REPLACE;
	}
}